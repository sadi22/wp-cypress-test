<?php
/**
 * CampaignEmailBuilderModel class.
 *
 * @package Mint\MRM\DataBase\Models
 * @namespace Mint\MRM\DataBase\Models
 * @author [MRM Team]
 * @email [support@rextheme.com]
 * @create date 2022-08-09 11:03:17
 * @modify date 2022-08-09 11:03:17
 */

namespace Mint\MRM\DataBase\Models;

use Mint\MRM\DataBase\Tables\CampaignEmailBuilderSchema;
use Mint\MRM\DataBase\Tables\CampaignSchema;
use Mint\Mrm\Internal\Traits\Singleton;

/**
 * CampaignEmailBuilderModel class
 *
 * Manage Campaign email builder related database operations.
 *
 * @package Mint\MRM\DataBase\Models
 * @namespace Mint\MRM\DataBase\Models
 *
 * @version 1.0.0
 */
class CampaignEmailBuilderModel {

	use Singleton;

	/**
	 * Check is it a new email template or not
	 *
	 * @param int $email_id email_id.
	 *
	 * @return int|bool
	 * @since 1.0.0
	 */
	public static function is_new_email_template( $email_id ) {
		global $wpdb;
		$email_builder_table = $wpdb->prefix . CampaignEmailBuilderSchema::$table_name;
		// phpcs:disable WordPress.DB.PreparedSQL.InterpolatedNotPrepared
		$query = $wpdb->prepare( "SELECT * FROM $email_builder_table WHERE email_id = %d", array( $email_id ) );
		// phpcs:enable WordPress.DB.PreparedSQL.InterpolatedNotPrepared
		// phpcs:disable WordPress.DB.PreparedSQL.NotPrepared
		$results = $wpdb->get_row( $query ); // db call ok. ; no-cache ok.
		// phpcs:disable WordPress.DB.PreparedSQL.NotPrepared
		if ( $results ) {
			return true;
		}
		return false;
	}

	/**
	 * Run SQL query to insert campaign email builder information into database
	 *
	 * @param mixed $args insert arguments.
	 *
	 * @return int|bool
	 * @since 1.0.0
	 */
	public static function insert( $args ) {
		global $wpdb;
		$email_builder_table = $wpdb->prefix . CampaignEmailBuilderSchema::$table_name;
		$args['created_at']  = current_time( 'mysql' );
		$inserted            = $wpdb->insert( $email_builder_table, $args ); // db call ok.
		if ( $inserted ) {
			return $wpdb->insert_id;
		}
		return false;
	}

	/**
	 * Run SQL query to update campaign email builder information into database.
	 *
	 * @param int   $email_id email id.
	 * @param array $args update arguments.
	 *
	 * @return void
	 * @since 1.0.0
	 */
	public static function update( $email_id, $args ) {
		global $wpdb;
		$email_builder_table = $wpdb->prefix . CampaignEmailBuilderSchema::$table_name;
		$args['updated_at']  = current_time( 'mysql' );
		$wpdb->update(
			$email_builder_table,
			$args,
			array(
				'email_id' => $email_id,
			)
		); // db call ok. ; no-cache ok.
	}


	/**
	 * Get single email template.
	 *
	 * @param int $id email id.
	 * @return array|bool|object|void|null
	 *
	 * @since 1.0.0
	 */
	public static function get( $id ) {
		global $wpdb;
		$email_builder_table = $wpdb->prefix . CampaignEmailBuilderSchema::$table_name;
		// phpcs:disable WordPress.DB.PreparedSQL.InterpolatedNotPrepared
		$select_query = $wpdb->prepare( "SELECT * FROM $email_builder_table WHERE email_id=%s", $id );
		// phpcs:enable WordPress.DB.PreparedSQL.InterpolatedNotPrepared
		$email = $wpdb->get_row( $select_query, ARRAY_A ); // db call ok. ; no-cache ok.

		if ( $email ) {
			$email_body          = isset( $email['email_body'] ) ? $email['email_body'] : '';
			$email_json_data     = isset( $email['json_data'] ) ? $email['json_data'] : '';
			$email['email_body'] = maybe_unserialize( $email_body );
			$email['json_data']  = maybe_unserialize( $email_json_data );
			return $email;
		}
		return null;
	}

}
