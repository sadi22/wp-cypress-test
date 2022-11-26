<?php
/**
 * REST API Campaign Controller
 *
 * Handles requests to the campaign endpoint.
 *
 * @author   MRM Team
 * @category API
 * @package  MRM
 * @since    1.0.0
 */

namespace Mint\MRM\Admin\API\Controllers;

use Mint\MRM\DataBase\Models\ContactGroupPivotModel;
use Mint\MRM\DataBase\Models\MessageModel;
use Mint\Mrm\Internal\Traits\Singleton;
use WP_REST_Request;
use Exception;
use Mint\MRM\DataBase\Models\CampaignEmailBuilderModel;
use MRM\Common\MRM_Common;
use Mint\MRM\DataBase\Models\CampaignModel as ModelsCampaign;
use Mint\MRM\DataBase\Models\ContactModel;

/**
 * This is the main class that controls the campaign feature. Its responsibilities are:
 *
 * - Create or update a custom field
 * - Delete single or multiple campaign
 * - Retrieve single or multiple campaign
 *
 * @package Mint\MRM\Admin\API\Controllers
 */
class CampaignController extends BaseController {

	use Singleton;


	/**
	 * Campaign object arguments
	 *
	 * @var object
	 * @since 1.0.0
	 */
	public $args = array();


	/**
	 * Campaign array from API response
	 *
	 * @var array
	 * @since 1.0.0
	 */
	public $campaign_data;


	/**
	 * Get and send response to create or update a campaign
	 *
	 * @param WP_REST_Request $request Request object used to generate the response.
	 * @return \WP_REST_Response
	 * @since 1.0.0
	 */
	public function create_or_update( WP_REST_Request $request ) {

		// Get values from API.
		$params = MRM_Common::get_api_params_values( $request );
		// Assign Untitled as value if title is empty.
		if ( isset( $params['title'] ) && empty( $params['title'] ) ) {
			$params['title'] = 'Untitled';
		}
		if ( strlen( $params['title'] ) > 150 ) {
			return $this->get_error_response( __( 'Campaign title character limit exceeded 150 characters', 'mrm' ), 200 );
		}

		$emails = isset( $params['emails'] ) ? $params['emails'] : array();

		// Email subject validation.
		if ( isset( $params['status'] ) ) {
			foreach ( $emails as $index => $email ) {
				$sender_email = isset( $email['sender_email'] ) ? $email['sender_email'] : '';
				if ( isset( $sender_email ) && empty( $sender_email ) ) {
					/* translators: %d email index */
					return $this->get_error_response( sprintf( __( 'Sender email is missing on email %d', 'mrm' ), ( $index + 1 ) ), 200 );
				}
				if ( ! is_email( $sender_email ) ) {
					/* translators: %d email index */
					return $this->get_error_response( sprintf( __( 'Sender Email Address is not valid on email %d', 'mrm' ), ( $index + 1 ) ), 203 );
				}
			}
		}

		try {
			// Update a campaign if campaign_id present on API request.
			if ( isset( $params['campaign_id'] ) ) {
				$campaign_id = $params['campaign_id'];

				$this->campaign_data = ModelsCampaign::update( $params, $campaign_id );

				if ( $this->campaign_data ) {
					// Update campaign recipients into meta table.
					$recipients = isset( $params['recipients'] ) ? maybe_serialize( $params['recipients'] ) : '';
					ModelsCampaign::update_campaign_recipients( $recipients, $campaign_id );

					// Update emails list.
					$emails = isset( $params['emails'] ) ? $params['emails'] : array();

					// set send_time key for all email of campaign.
					$emails = array_map(
						function( $email ) {
							$email['send_time'] = 0;
							return $email;
						},
						$emails
					);

					foreach ( $emails as $index => $email ) {
						// counting the sending time for each email.
						$delay = isset( $email['delay'] ) ? $email['delay'] : 0;

						if ( 0 === $index ) {
							$email['send_time']            = microtime( true );
							$emails[ $index ]['send_time'] = $email['send_time'];
						} else {
							$prev_send_time                = $emails[ $index - 1 ]['send_time'];
							$email['send_time']            = $delay + $prev_send_time;
							$emails[ $index ]['send_time'] = $email['send_time'];
						}

						$data['campaign'] = $this->campaign_data;

						if ( isset( $data['campaign']['status'] ) && 'active' === $data['campaign']['status'] ) {
							$email['scheduled_at'] = current_time( 'mysql' );
							$email['status']       = 'scheduled';
						}

						if ( isset( $data['campaign']['status'] ) && 'draft' === $data['campaign']['status'] ) {
							$email['scheduled_at'] = null;
							$email['status']       = 'draft';
						}

						ModelsCampaign::update_campaign_emails( $email, $campaign_id, $index );
					}
				}
			} else {
				// Insert campaign information.
				$this->campaign_data = ModelsCampaign::insert( $params );
				$campaign_id         = isset( $this->campaign_data['id'] ) ? $this->campaign_data['id'] : '';
				if ( $campaign_id ) {
					// Insert campaign recipients information.
					$recipients = isset( $params['recipients'] ) ? maybe_serialize( $params['recipients'] ) : '';
					ModelsCampaign::insert_campaign_recipients( $recipients, $campaign_id );

					// Insert campaign emails information.
					$emails = isset( $params['emails'] ) ? $params['emails'] : array();

					// set send_time key for all email of campaign.
					$emails = array_map(
						function( $email ) {
							$email['send_time'] = 0;
							return $email;
						},
						$emails
					);

					foreach ( $emails as $index => $email ) {
						// counting the sending time for each email.
						$delay = isset( $email['delay'] ) ? $email['delay'] : 0;

						if ( 0 === $index ) {
							$email['send_time']            = microtime( true );
							$emails[ $index ]['send_time'] = microtime( true );
						} else {
							$prev_send_time                = $emails[ $index - 1 ]['send_time'];
							$email['send_time']            = $delay + $prev_send_time;
							$emails[ $index ]['send_time'] = $email['send_time'];
						}

						$data['campaign'] = $this->campaign_data;

						if ( isset( $data['campaign']['status'] ) && 'active' === $data['campaign']['status'] ) {
							$email['scheduled_at'] = current_time( 'mysql' );
							$email['status']       = 'scheduled';
						}

						if ( isset( $data['campaign']['status'] ) && 'draft' === $data['campaign']['status'] ) {
							$email['scheduled_at'] = null;
							$email['status']       = 'draft';
						}
						ModelsCampaign::insert_campaign_emails( $email, $campaign_id, $index );
					}
				}
			}

			// Send renponses back to the frontend.
			if ( $this->campaign_data ) {
				$data['campaign'] = $this->campaign_data;
				if ( isset( $data['campaign']['status'] ) && 'active' === $data['campaign']['status'] ) {
					return $this->get_success_response( __( 'Campaign has been started successfully', 'mrm' ), 201, $data );
				}
				return $this->get_success_response( __( 'Campaign has been saved successfully', 'mrm' ), 201, $data );
			}
			return $this->get_error_response( __( 'Failed to save', 'mrm' ), 400 );
		} catch ( Exception $e ) {
			return $this->get_error_response( __( 'Failed to save campaign', 'mrm' ), 400 );
		}
	}

	/**
	 * Get and send response to send campaign email
	 *
	 * @param int   $campaign_id Campaign ID to get contacts email.
	 * @param mixed $params Campaign parameters.
	 * @return void
	 * @since 1.0.0
	 */
	public static function send_campaign_email( $campaign_id, $params ) {
		$campaign = ModelsCampaign::get( $campaign_id );

		$meta = maybe_unserialize( $campaign->meta );

		$tags  = $meta['tags'];
		$lists = $meta['lists'];

		$groups = array_merge( $tags, $lists );

		$count     = ContactGroupPivotModel::get_contacts_count_to_campaign( $groups );
		$per_batch = 30;

		$total_batch = ceil( $count / $per_batch );

		for ( $i = 1; $i <= $total_batch; $i++ ) {
			$contacts = ContactGroupPivotModel::get_contacts_to_campaign( $groups, $i + $per_batch, $per_batch );
			$messages = array_map(
				function( $contact ) use ( $campaign ) {
					return array(
						'email_address' => $contact->email,
						'email_subject' => $campaign->email_subject,
						'email_body'    => $campaign->email_body,
						'contact_id'    => $contact->id,
						'sender_email'  => $campaign->sender_email,
						'sender_name'   => $campaign->sender_name,
						'campaign_id'   => $campaign->id,
					);
				},
				$contacts
			);

			do_action( 'mrm_send_campaign_email', $messages );
		}
	}


	/**
	 * Request for deleting a single campaign to Campaign Model by Campaign ID
	 *
	 * @param WP_REST_Request $request Request object used to generate the response.
	 * @return WP_REST_Response
	 * @since 1.0.0
	 */
	public function delete_single( WP_REST_Request $request ) {

		// Get values from API.
		$params      = MRM_Common::get_api_params_values( $request );
		$campaign_id = isset( $params['campaign_id'] ) ? $params['campaign_id'] : '';
		$success     = ModelsCampaign::destroy( $campaign_id );

		if ( $success ) {
			return $this->get_success_response( __( 'Campaign has been deleted successfully', 'mrm' ), 200 );
		}
		return $this->get_error_response( __( 'Failed to Delete', 'mrm' ), 400 );
	}


	/**
	 * Request for deleting a email from a campaign
	 *
	 * @param WP_REST_Request $request Request object used to generate the response.
	 * @return WP_REST_Response
	 * @since 1.0.0
	 */
	public function delete_campaign_email( WP_REST_Request $request ) {
		// Get values from API.
		$params = MRM_Common::get_api_params_values( $request );

		$campaign_id = isset( $params['campaign_id'] ) ? $params['campaign_id'] : '';
		$email_id    = isset( $params['email_id'] ) ? $params['email_id'] : '';

		$success = ModelsCampaign::remove_email_from_campaign( $campaign_id, $email_id );
		if ( $success ) {
			return $this->get_success_response( __( 'Campaign email has been deleted successfully', 'mrm' ), 200 );
		}
		return $this->get_error_response( __( 'Failed to Delete', 'mrm' ), 400 );
	}


	/**
	 * Request for deleting multiple campaigns to Campaign Model by Campaign ID
	 *
	 * @param WP_REST_Request $request Request object used to generate the response.
	 * @return WP_REST_Response
	 * @since 1.0.0
	 */
	public function delete_all( WP_REST_Request $request ) {
		// Get values from API.
		$params = MRM_Common::get_api_params_values( $request );

		$campaign_ids = isset( $params['campaign_ids'] ) ? $params['campaign_ids'] : array();

		$success = ModelsCampaign::destroy_all( $campaign_ids );

		if ( $success ) {
			return $this->get_success_response( __( 'Campaign has been deleted successfully', 'mrm' ), 200 );
		}

		return $this->get_error_response( __( 'Failed to delete', 'mrm' ), 400 );
	}


	/**
	 * Get all campaign request to Campaign Model
	 *
	 * @param WP_REST_Request $request Request object used to generate the response.
	 * @return WP_REST_Response
	 * @since 1.0.0
	 */
	public function get_all( WP_REST_Request $request ) {

		// Get values from API.
		$params = MRM_Common::get_api_params_values( $request );

		$page     = isset( $params['page'] ) ? $params['page'] : 1;
		$per_page = isset( $params['per-page'] ) ? $params['per-page'] : 10;
		$offset   = ( $page - 1 ) * $per_page;

		$order_by   = isset( $params['order-by'] ) ? strtolower( $params['order-by'] ) : 'id';
		$order_type = isset( $params['order-type'] ) ? strtolower( $params['order-type'] ) : 'desc';

		// valid order by fields and types.
		$allowed_order_by_fields = array( 'title', 'created_at' );
		$allowed_order_by_types  = array( 'asc', 'desc' );

		// validate order by fields or use default otherwise.
		$order_by   = in_array( $order_by, $allowed_order_by_fields, true ) ? $order_by : 'id';
		$order_type = in_array( $order_type, $allowed_order_by_types, true ) ? $order_type : 'desc';

		// Contact Search keyword.
		$search = isset( $params['search'] ) ? $params['search'] : '';

		$campaigns = ModelsCampaign::get_all( $offset, $per_page, $search, $order_by, $order_type );

		$campaigns['current_page'] = (int) $page;

		// Prepare human_time_diff for every campaign.
		if ( isset( $campaigns['data'] ) ) {
			$campaigns['data'] = array_map(
				function( $campaign ) {
					if ( isset( $campaign['created_at'] ) ) {
						$campaign['created_at'] = human_time_diff( strtotime( $campaign['created_at'] ), time() );
					}
					return $campaign;
				},
				$campaigns['data']
			);
		}

		if ( isset( $campaigns ) ) {
			return $this->get_success_response( __( 'Query Successfull', 'mrm' ), 200, $campaigns );
		}
		return $this->get_error_response( __( 'Failed to get data', 'mrm' ), 400 );
	}


	/**
	 * Function use to get single campaign
	 *
	 * @param WP_REST_Request $request Request object used to generate the response.
	 * @return WP_REST_Response
	 * @since 1.0.0
	 */
	public function get_single( WP_REST_Request $request ) {

		// Get values from REST API JSON.
		$params      = MRM_Common::get_api_params_values( $request );
		$campaign_id = isset( $params['campaign_id'] ) ? $params['campaign_id'] : '';
		$campaign    = ModelsCampaign::get( $campaign_id );
		// Prepare campaign data for response.
		$campaign['meta']['recipients'] = maybe_unserialize( $campaign['meta_value'] );
		$recipients_emails              = self::get_reciepents_email( $campaign_id );
		$campaign['total_recipients']   = count( $recipients_emails );
		unset( $campaign['meta_key'] );
		unset( $campaign['meta_value'] );

		if ( isset( $campaign ) ) {
			return $this->get_success_response( 'Query Successfull', 200, $campaign );
		}
		return $this->get_error_response( 'Failed to Get Data', 400 );
	}

	/**
	 * Function use to schedule the action for campaign emails
	 *
	 * @param mixed $messages Message object used to generate the response.
	 * @return void
	 * @since 1.0.0
	 */
	public function process_campaign_email( $messages ) {
		$data = array();
		if ( function_exists( 'as_has_scheduled_action' ) ) {
			if ( false === as_has_scheduled_action( 'mrm/process_campaign_email' ) ) {
				$data['data'] = $messages;
				as_schedule_single_action( time(), 'mrm/process_campaign_email', $data );
			}
		} elseif ( function_exists( 'as_next_scheduled_action' ) ) {
			if ( false === as_next_scheduled_action( 'mrm/process_campaign_email' ) ) {
				$data['data'] = $messages;
				as_schedule_single_action( time(), 'mrm/process_campaign_email', $data );
			}
		}
	}

	/**
	 * Function use send campaign email to a recipients
	 *
	 * @param mixed $data $request Data object used to generate the response.
	 * @return void
	 * @since 1.0.0
	 */
	public function process_campaign_email_send( $data ) {
		foreach ( $data as $message ) {
			MessageModel::insert( $message, $message['campaign_id'] );
			$sent = MessageController::get_instance()->send_message( $message );
		}
	}


	/**
	 * Function use to send email
	 *
	 * @param array $campaign Single campaign object.
	 * @return WP_REST_Response
	 * @since 1.0.0
	 */
	public function send_email_to_reciepents( $campaign ) {
		$campaign_id       = isset( $campaign['id'] ) ? $campaign['id'] : '';
		$recipients_emails = self::get_reciepents_email( $campaign_id );

		$recipients  = array_map(
			function( $recipients_email ) {
				if ( isset( $recipients_email['email'] ) ) {
					return $recipients_email['email'];
				}
			},
			$recipients_emails
		);
		$emails      = ModelsCampaign::get_campaign_email( $campaign_id );
		$first_email = isset( $emails[0] ) ? $emails[0] : array();

		$email_builder = CampaignEmailBuilderModel::get( $first_email['id'] );
		$sender_email  = isset( $first_email['sender_email'] ) ? $first_email['sender_email'] : '';
		$sender_name   = isset( $first_email['sender_name'] ) ? $first_email['sender_name'] : '';
		$email_subject = isset( $first_email['email_subject'] ) ? $first_email['email_subject'] : '';
		$email_body    = $email_builder['email_body'];

		$headers = array(
			'MIME-Version: 1.0',
			'Content-type: text/html;charset=UTF-8',
		);

		$from      = '';
		$from      = 'From: ' . $sender_name;
		$headers[] = $from . ' <' . $sender_email . '>';
		$headers[] = 'Reply-To:  ' . $sender_email;

		try {
			foreach ( $recipients as $recipient ) {
				wp_mail( $recipient, $email_subject, $email_body, $headers );
			}
		} catch ( \Exception $e ) {
			return false;
		}
	}


	/**
	 * Function use to get recipients
	 *
	 * @param int $campaign_id Campaign ID to get campaign information.
	 * @param int $offset Offset for retrive rows from database table.
	 * @param int $per_batch Batch number for email sending.
	 * @return array
	 * @since 1.0.0
	 */
	public static function get_reciepents_email( $campaign_id, $offset = 0, $per_batch = 0 ) {
		$all_receipents = ModelsCampaign::get_campaign_meta( $campaign_id );

		if ( isset( $all_receipents['recipients']['lists'], $all_receipents['recipients']['tags'] ) ) {
			$group_ids = array_merge( $all_receipents['recipients']['lists'], $all_receipents['recipients']['tags'] );
		} else {
			isset( $all_receipents['recipients']['lists'] ) ? $group_ids  = $all_receipents['recipients']['lists'] :
			( isset( $all_receipents['recipients']['tags'] ) ? $group_ids = $all_receipents['recipients']['tags'] :
			$group_ids = array() );
		}

		$recipients_ids = ContactGroupPivotModel::get_contacts_to_group( array_column( $group_ids, 'id' ), $offset, $per_batch );
		$recipients_ids = array_column( $recipients_ids, 'contact_id' );
		return ContactModel::get_single_email( $recipients_ids );
	}


	/**
	 * Update a campaign's status
	 *
	 * @param WP_REST_Request $request Request object used to generate the response.
	 *
	 * @return WP_REST_Response
	 * @since 1.0.0
	 */
	public function status_update( WP_REST_Request $request ) {
		// Get params from status update API request.
		$params = MRM_Common::get_api_params_values( $request );

		$status      = isset( $params['status'] ) ? $params['status'] : '';
		$campaign_id = isset( $params['campaign_id'] ) ? $params['campaign_id'] : '';

		$update = ModelsCampaign::update_campaign_status( $campaign_id, $status );

		if ( $update ) {
			return $this->get_success_response( __( 'Campaign status has been updated successfully', 'mrm' ), 201 );
		}
		return $this->get_error_response( __( 'Failed to update campaign status', 'mrm' ), 400 );
	}


	/**
	 * Returns all publish campaigns
	 *
	 * @return array
	 * @since 1.0.0
	 */
	public function get_publish_campaign_id() {
		return ModelsCampaign::get_publish_campaign_id();
	}

}
