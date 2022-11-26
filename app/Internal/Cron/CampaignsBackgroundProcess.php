<?php
/**
 * Mail Mint
 *
 * @author [MRM Team]
 * @email [support@rextheme.com]
 * @create date 2022-08-09 11:03:17
 * @modify date 2022-08-09 11:03:17
 * @package /app/Internal/Cron
 */

namespace Mint\MRM\Internal\Cron;

use Mint\MRM\DataBase\Models\CampaignEmailBuilderModel;
use Mint\MRM\DataBase\Models\CampaignModel;
use Mint\MRM\DataBase\Models\CampaignModel as ModelsCampaign;
use Mint\Mrm\Internal\Traits\Singleton;
use Mint\MRM\Admin\API\Controllers\CampaignController;
use Mint\MRM\DataBase\Tables\CampaignScheduledEmailsSchema;
use Mint\MRM\Utilites\Helper\ContactData;

/**
 * [Manage plugin's Cron functionalities]
 *
 * @desc Manage plugin's assets
 * @package /app/Internal/Cron
 * @since 1.0.0
 */
class CampaignsBackgroundProcess {

	use Singleton;

	/**
	 * A private variable to save scheduling emails process [background]
	 * initialization time
	 *
	 * @since 1.0.0
	 * @var float $process_creation_time
	 */

	private $email_schedule_creation_time;

	/**
	 * A private variable to save sending emails process [background]
	 * initialization time
	 *
	 * @since 1.0.0
	 * @var float $email_sending_process_creation_time
	 */
	private $email_sending_process_creation_time;

	/**
	 * Initialize cron functionalities
	 *
	 * @return void
	 * @since 1.0.0
	 */
	public function init() {
		add_filter( 'cron_schedules', array( $this, 'add_five_mins_cron_hook' ) ); //phpcs:ignore
		add_action( 'admin_init', array( $this, 'register_cron_schedules' ) );
		add_action( 'mrm_schedule_emails', array( $this, 'process_scheduled_campaign_emails' ) );
		add_action( 'mrm_send_recipient_emails', array( $this, 'send_recipient_emails' ) );
	}

	/**
	 * Add five minutes cron in core schedules
	 *
	 * @param array $schedules Array of cron schedules.
	 *
	 * @return array
	 * @since 1.0.0
	 */
	public function add_five_mins_cron_hook( array $schedules ) {
		$schedules[ 'every_five_minutes' ] = array(
			'interval' => 300,
			'display'  => __( 'Every 5 Minutes', 'mrm' ),
		);

		return $schedules;
	}

	/**
	 * Register email scheduler on every five minutes
	 *
	 * @return void
	 * @since 1.0.0
	 */
	public function register_cron_schedules() {
		if ( ! wp_next_scheduled( 'mrm_schedule_emails' ) ) {
			wp_schedule_event( time(), 'every_five_minutes', 'mrm_schedule_emails', array(), true );
		}
		if ( ! wp_next_scheduled( 'mrm_send_recipient_emails' ) ) {
			wp_schedule_event( time(), 'every_five_minutes', 'mrm_send_recipient_emails', array(), true );
		}
	}


	/**
	 * Configure campaign emails and insert
	 * the recipient emails to mrm_campaign_scheduled_emails table
	 *
	 * @return void
	 * @since 1.0.0
	 */
	public function process_scheduled_campaign_emails() {
		$schedule_email_status = 'mrm_email_scheduling_process_status';
		if ( ! $this->process_locked( $schedule_email_status ) ) {
			global $wpdb;
			$this->lock_process( $schedule_email_status );
			$this->email_schedule_creation_time = microtime( true );
			$campaigns                          = CampaignController::get_instance()->get_publish_campaign_id();
			$campaign_ids                       = array_column( $campaigns, 'id' );
			$campaign_scheduled_emails_table    = $wpdb->prefix . CampaignScheduledEmailsSchema::$campaign_scheduled_emails_table;
			$last_recipient_id                  = 0;

			foreach ( $campaign_ids as $campaign_id ) {
				$campaign_emails = CampaignModel::get_campaign_email_for_background( $campaign_id );
				if ( is_array( $campaign_emails ) && ! empty( $campaign_emails ) ) {
					foreach ( $campaign_emails as $campaign_email ) {
						$campaign_email_id = isset( $campaign_email[ 'id' ] ) ? $campaign_email[ 'id' ] : '';

						$offset            = get_option( 'mrm_campaign_email_recipients_scheduling_offset_' . $campaign_id . '_' . $campaign_email_id, 0 );
						$per_batch         = 10;
						$recipients_emails = CampaignController::get_reciepents_email( $campaign_id, $offset, $per_batch );
						$delay_count       = isset( $campaign_email[ 'delay_count' ] ) ? $campaign_email[ 'delay_count' ] : 0;
						$delay_val         = isset( $campaign_email[ 'delay_value' ] ) ? $campaign_email[ 'delay_value' ] : '';
						$delay_val         = str_replace( 's', '', $delay_val );
						if ( is_array( $recipients_emails ) && ! empty( $recipients_emails ) ) {
							foreach ( $recipients_emails as $email ) {
								if ( isset( $email[ 'id' ], $email[ 'email' ] ) && $email[ 'id' ] && $email[ 'email' ] ) {
									$mysql_format = 'Y-m-d H:i:s';
									$scheduled_at = date( $mysql_format, strtotime( '+' . $delay_count . ' ' . $delay_val ) ); //phpcs:ignore
									$updated_at   = date( $mysql_format ); //phpcs:ignore

									$wpdb->insert( //phpcs:ignore
										$campaign_scheduled_emails_table,
										array(
											'campaign_id'  => $campaign_id,
											'email_id'     => $campaign_email_id,
											'contact_id'   => $email[ 'id' ],
											'email'        => $email[ 'email' ],
											'status'       => 'scheduled',
											'scheduled_at' => $scheduled_at,
										)
									);
									update_option( 'mrm_campaign_email_recipients_scheduling_offset_' . $campaign_id . '_' . $campaign_email_id, ++ $offset );

									$last_recipient_id = $email[ 'id' ];
								}
								if ( $this->time_exceeded( $schedule_email_status ) || $this->memory_exceeded() ) {
									break;
								}
							}
							CampaignModel::update_campaign_email_meta( $campaign_email_id, '_last_recipient_id', $last_recipient_id );
						}

						if ( $this->time_exceeded( $schedule_email_status ) || $this->memory_exceeded() ) {
							break;
						}
					}
				} else {
					CampaignModel::update_campaign_status( $campaign_id, 'archived' );
				}

				if ( $this->time_exceeded( $schedule_email_status ) || $this->memory_exceeded() ) {
					break;
				}
			}
			$this->unlock_process( $schedule_email_status );
		}
	}

	/**
	 * Send emails and handle time/memory limits
	 *
	 * @return void
	 * @since 1.0.0
	 */
	public function send_recipient_emails() {
		$sending_emails_status = 'mrm_sending_emails_process_status';
		if ( ! $this->process_locked( $sending_emails_status ) ) {
			$this->email_sending_process_creation_time = microtime( true );
			$this->lock_process( $sending_emails_status );
			$per_batch        = 10;
			$offset           = 0;
			$recipient_emails = $this->get_recipient_emails( $offset, $per_batch );

			if ( is_array( $recipient_emails ) && ! empty( $recipient_emails ) ) {
				foreach ( $recipient_emails as $recipient ) {
					$recipient_email    = isset( $recipient[ 'email' ] ) ? sanitize_email( $recipient[ 'email' ] ) : '';
					$email_scheduled_id = isset( $recipient[ 'id' ] ) ? (int) $recipient[ 'id' ] : '';
					$scheduled_email_id = isset( $recipient[ 'email_id' ] ) ? (int) $recipient[ 'email_id' ] : '';
					$campaign_id        = isset( $recipient[ 'campaign_id' ] ) ? (int) $recipient[ 'campaign_id' ] : '';
					$contact_id         = isset( $recipient[ 'contact_id' ] ) ? (int) $recipient[ 'contact_id' ] : '';

					$headers = array(
						'MIME-Version: 1.0',
						'Content-type: text/html;charset=UTF-8',
					);

					$email_builder = CampaignEmailBuilderModel::get( $scheduled_email_id );
					$email         = CampaignModel::get_campaign_email_by_id( $campaign_id, $scheduled_email_id );
					$email_body    = isset( $email_builder[ 'email_body' ] ) ? $email_builder[ 'email_body' ] : '';
					$sender_email  = isset( $email->sender_email ) ? $email->sender_email : '';
					$sender_name   = isset( $email->sender_name ) ? $email->sender_name : '';
					$email_subject = isset( $email->email_subject ) ? self::update_dynamic_placeholders( $email->email_subject, $contact_id ) : '';
					$email_preview = isset( $email->email_preview_text ) ? self::update_dynamic_placeholders( $email->email_preview_text, $contact_id ) : '';

					$from      = 'From: ' . $sender_name;
					$headers[] = $from . ' <' . $sender_email . '>';
					$headers[] = 'Reply-To: ' . $sender_email;

					$email_sent = wp_mail( $recipient_email, $email_subject, $email_body, $headers );

					if ( $email_sent ) {
						self::update_scheduled_emails_status( $email_scheduled_id, 'sent' );
					} else {
						self::update_scheduled_emails_status( $email_scheduled_id, 'failed' );
					}
					$meta_value = CampaignModel::get_campaign_email_meta( $scheduled_email_id, '_last_recipient_id' );
					if ( (int) $contact_id === (int) $meta_value ) {
						CampaignModel::update_campaign_email_status( $campaign_id, $scheduled_email_id, 'sent' );
					}
					if ( $this->time_exceeded( $sending_emails_status ) || $this->memory_exceeded() ) {
						break;
					}
				}
			}

			$this->unlock_process( $sending_emails_status );
		}
	}

	/**
	 * Update email status in mrm_campaign_scheduled_emails table
	 *
	 * @param int    $email_scheduled_id Email id that was scheduled in mrm_campaign_scheduled_emails table.
	 * @param string $status Updated status.
	 *
	 * @return void
	 * @since 1.0.0
	 */
	private static function update_scheduled_emails_status( int $email_scheduled_id, string $status ) {
		global $wpdb;
		$campaign_email_scheduled_table = $wpdb->prefix . CampaignScheduledEmailsSchema::$campaign_scheduled_emails_table;
		$wpdb->update( //phpcs:ignore
			$campaign_email_scheduled_table,
			array(
				'status'     => $status,
				'updated_at' => current_time( 'mysql', true ),
			),
			array( 'id' => $email_scheduled_id )
		);
	}

	/**
	 * Get recipient emails from mrm_campaign_scheduled_emails table batch wise
	 *
	 * @param int $offset MySQL offset variable to skip data while fetching.
	 * @param int $per_batch Number of data needed to fetch in data fetch.
	 *
	 * @return array|object|\stdClass[]|null
	 * @since 1.0.0
	 */
	private function get_recipient_emails( int $offset, int $per_batch ) {
		global $wpdb;
		$campaign_email_scheduled_table = $wpdb->prefix . CampaignScheduledEmailsSchema::$campaign_scheduled_emails_table;
		$sql_query                      = "SELECT * FROM {$campaign_email_scheduled_table} ";
		$sql_query                     .= 'WHERE `status` = %s ';
		$sql_query                     .= 'AND `scheduled_at` <= %s ';
		$sql_query                     .= 'LIMIT %d, %d';
		$sql_query                      = $wpdb->prepare( $sql_query, 'scheduled', current_time( 'mysql', true ), $offset, $per_batch ); //phpcs:ignore

		return $wpdb->get_results( $sql_query, ARRAY_A ); //phpcs:ignore
	}

	/**
	 * Check process status if
	 * its already running (locked) or not
	 *
	 * @param string $process_name Name of the background process.
	 *
	 * @return bool
	 * @since 1.0.0
	 */
	private function process_locked( string $process_name ) {
		return 'locked' === get_option( $process_name, 'unlocked' );
	}

	/**
	 * Lock the process before starting
	 *
	 * @param string $process_name Name of the background process.
	 *
	 * @return void
	 * @since 1.0.0
	 */
	private function lock_process( string $process_name ) {
		update_option( $process_name, 'locked' );
	}

	/**
	 * Unlock the process after
	 * finishing all tasks
	 *
	 * @param string $process_name Name of the background process.
	 *
	 * @return void
	 * @since 1.0.0
	 */
	private function unlock_process( string $process_name ) {
		update_option( $process_name, 'unlocked' );
	}

	/**
	 * Check if process time limits already exceeded
	 *
	 * @param string $process_name Name of the background process.
	 *
	 * @return mixed|null
	 * @since 1.0.0
	 */
	private function time_exceeded( string $process_name ) {
		$execution_time        = $this->get_execution_time( $process_name );
		$max_execution_time    = ini_get( 'max_execution_time' );
		$max_execution_time    = $max_execution_time - ( apply_filters( 'ebp_exclude_safe_time_limits', 20 ) * $max_execution_time / 100 );
		$likely_to_be_exceeded = $execution_time > $max_execution_time;

		return apply_filters( 'ebp_max_execution_time_exceeded', $likely_to_be_exceeded, $execution_time, $max_execution_time );
	}

	/**
	 * Calculate and get current process
	 * execution time by this time
	 *
	 * @param string $process_name Name of the background process.
	 *
	 * @return float|int|mixed
	 * @since 1.0.0
	 */
	private function get_execution_time( string $process_name ) {
		if ( 'mrm_email_scheduling_process_status' === $process_name ) {
			$process_start_time = $this->email_schedule_creation_time;
		} elseif ( 'mrm_sending_emails_process_status' === $process_name ) {
			$process_start_time = $this->email_sending_process_creation_time;
		}

		$execution_time = microtime( true ) - $process_start_time;

		// Get the CPU time if the hosting environment uses it rather than wall-clock time to calculate a process's execution time.
		if ( function_exists( 'getrusage' ) && apply_filters( 'ebp_cpu_execution_time', defined( 'PANTHEON_ENVIRONMENT' ) ) ) {
			$resource_usages = getrusage();

			if ( isset( $resource_usages[ 'ru_stime.tv_usec' ], $resource_usages[ 'ru_stime.tv_usec' ] ) ) {
				$execution_time = $resource_usages[ 'ru_stime.tv_sec' ] + ( $resource_usages[ 'ru_stime.tv_usec' ] / 1000000 );
			}
		}

		return $execution_time;
	}

	/**
	 * Check if current process exceeded
	 * available memory limits
	 *
	 * @return mixed|null
	 * @since 1.0.0
	 */
	private function memory_exceeded() {
		$allowed_memory  = apply_filters( 'ebp_max_allowed_memory_limit', 20 ) / 100;
		$memory_limit    = $this->get_memory_limit() * $allowed_memory;
		$current_memory  = memory_get_usage( true );
		$memory_exceeded = $current_memory >= $memory_limit;

		return apply_filters( 'ebp_memory_exceeded', $memory_exceeded, $this );
	}

	/**
	 * Get php memory limits
	 *
	 * @return int|mixed
	 * @since 1.0.0
	 */
	private function get_memory_limit() {
		if ( function_exists( 'ini_get' ) ) {
			$memory_limit = ini_get( 'memory_limit' );
		} else {
			$memory_limit = '128M'; // Sensible default, and minimum required by WooCommerce.
		}

		if ( ! $memory_limit || - 1 === $memory_limit || '-1' === $memory_limit ) {
			// Unlimited, set to 32GB.
			$memory_limit = '32G';
		}

		return $this->convert_hr_to_bytes( $memory_limit );
	}

	/**
	 * Converts a shorthand byte value to an integer byte value
	 *
	 * @param string $value Shorthand byte value.
	 *
	 * @return int|mixed
	 * @since 1.0.0
	 */
	private function convert_hr_to_bytes( string $value ) {
		if ( function_exists( 'wp_convert_hr_to_bytes' ) ) {
			return wp_convert_hr_to_bytes( $value );
		}

		$value = strtolower( trim( $value ) );
		$bytes = (int) $value;

		if ( false !== strpos( $value, 'g' ) ) {
			$bytes *= GB_IN_BYTES;
		} elseif ( false !== strpos( $value, 'm' ) ) {
			$bytes *= MB_IN_BYTES;
		} elseif ( false !== strpos( $value, 'k' ) ) {
			$bytes *= KB_IN_BYTES;
		}

		// Deal with large (float) values which run into the maximum integer size.
		return min( $bytes, PHP_INT_MAX );
	}

	/**
	 * Replace custom placeholders from email subject
	 *
	 * @param string $data String value of email subject/preview/body text.
	 * @param int    $contact_id MRM contact id.
	 *
	 * @return array|string|string[]
	 */
	private function update_dynamic_placeholders( string $data, int $contact_id ) {
		$data = str_replace( '{{first_name}}', ContactData::get_info( $contact_id, 'first_name' ), $data );
		$data = str_replace( '{{last_name}}', ContactData::get_info( $contact_id, 'last_name' ), $data );
		$data = str_replace( '{{email}}', ContactData::get_info( $contact_id, 'email' ), $data );
		$data = str_replace( '{{city}}', ContactData::get_meta( $contact_id, 'city' ), $data );
		$data = str_replace( '{{state}}', ContactData::get_meta( $contact_id, 'state' ), $data );
		$data = str_replace( '{{country}}', ContactData::get_meta( $contact_id, 'country' ), $data );
		$data = str_replace( '{{company}}', ContactData::get_meta( $contact_id, 'company' ), $data );
		$data = str_replace( '{{designation}}', ContactData::get_meta( $contact_id, 'designation' ), $data );

		return $data;
	}
}
