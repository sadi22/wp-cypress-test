<?php
/**
 * Manage message related databse operation.
 *
 * @package Mint\MRM\DataBase\Models
 * @namespace Mint\MRM\DataBase\Models
 * @author [MRM Team]
 * @email [support@rextheme.com]
 * @create date 2022-08-09 11:03:17
 * @modify date 2022-08-09 11:03:17
 */

namespace Mint\MRM\DataBase\Models;

use Mint\MRM\DataBase\Tables\MessageSchema;
use MRM\Common\MRM_Common;
use Mint\Mrm\Internal\Traits\Singleton;

/**
 * MessageModel class
 *
 * Manage message related databse operation.
 *
 * @package Mint\MRM\DataBase\Models
 * @namespace Mint\MRM\DataBase\Models
 *
 * @version 1.0.0
 */
class MessageModel {

	use Singleton;

	/**
	 * SQL query to create a new message
	 *
	 * @param mixed $message MRM_Message object.
	 * @return bool
	 * @since 1.0.0
	 */
	public static function insert( $message ) {
		global $wpdb;
		$table = $wpdb->prefix . MessageSchema::$table_name;

		return $wpdb->insert(
			$table,
			array(
				'contact_id'    => $message->get_receiver_id(),
				'email_address' => $message->get_receiver_email(),
				'email_subject' => $message->get_email_subject(),
				'email_body'    => $message->get_email_body(),
				'sender_id'     => $message->get_sender_id(),
				'created_at'    => current_time( 'mysql' ),
			)
		); // db call ok. ; no-cache ok.
	}


	/**
	 * SQL query to get all emails relate to a contact or all users
	 *
	 * @param mixed $offset offset.
	 * @param mixed $limit limit.
	 * @param mixed $search search.
	 * @param mixed $contact_id contact id.
	 * @return bool\array
	 * @since 1.0.0
	 */
	public static function get_emails_to_contact( $offset = 0, $limit = 10, $search = '', $contact_id = null ) {
		global $wpdb;
		$table_name            = $wpdb->prefix . MessageSchema::$table_name;
		$search_terms          = null;
		$contact_emails_search = null;

		// Search email by address, or subject.
		if ( ! empty( $search ) ) {
			$search       = $wpdb->esc_like( $search );
			$search_terms = "WHERE email_address LIKE '%" . $search . "%' OR email_subject LIKE '%" . $search . "%'";
		}

		if ( ! empty( $contact_id ) ) {
			$search_terms = "WHERE contact_id = {$contact_id}";
		}

		if ( ! empty( $search ) && ! empty( $contact_id ) ) {
			$search_terms = "WHERE email_address LIKE '%" . $search . "%' OR email_subject LIKE '%" . $search . "%' AND contact_id = '%" . $contact_id . "%'";
		}

		// Prepare sql results for list view.
		try {
			// phpcs:disable WordPress.DB.PreparedSQL.InterpolatedNotPrepared 
			$select_query = $wpdb->prepare( "SELECT * FROM {$table_name} %s ORDER BY id DESC LIMIT %d, %d", array( $search_terms, $offset, $limit ) );
			// phpcs:enable WordPress.DB.PreparedSQL.InterpolatedNotPrepared 
			// phpcs:disable WordPress.DB.PreparedSQL.NotPrepared 
			$query_results = $wpdb->get_results( $select_query ); // db call ok. no-cache ok.
			// phpcs:enable WordPress.DB.PreparedSQL.NotPrepared 
			$results = json_decode( wp_json_encode( $query_results ), true );

			// phpcs:disable WordPress.DB.PreparedSQL.InterpolatedNotPrepared 
			$count_query = $wpdb->prepare( "SELECT COUNT(*) as total FROM {$table_name} %s", $search_terms );
			// phpcs:enable WordPress.DB.PreparedSQL.InterpolatedNotPrepared 
			// phpcs:disable WordPress.DB.PreparedSQL.NotPrepared 
			$count_data = $wpdb->get_results( $count_query ); // db call ok. no-cache ok.
			// phpcs:disable WordPress.DB.PreparedSQL.NotPrepared 
			$count_array = json_decode( wp_json_encode( $count_data ), true );

			$count       = (int) $count_array['0']['total'];
			$total_pages = ceil( $count / $limit );

			return array(
				'data'        => $results,
				'total_pages' => $total_pages,
			);
		} catch ( \Exception $e ) {
			return null;
		}
	}

	/**
	 * SQL query to get all emails relate to a contact
	 *
	 * @param mixed $contact_id contact id.
	 * @return bool\array
	 * @since 1.0.0
	 */
	public static function get_messages( $contact_id ) {
		global $wpdb;
		$message_table_name = $wpdb->prefix . MessageSchema::$table_name;
		// phpcs:disable WordPress.DB.PreparedSQL.InterpolatedNotPrepared 
		$sql = $wpdb->prepare( "SELECT * FROM {$message_table_name} WHERE `contact_id` = %d", $contact_id );
		// phpcs:enable WordPress.DB.PreparedSQL.InterpolatedNotPrepared 

		try {
			$messages = $wpdb->get_results( $sql, ARRAY_A ); // db call ok. no-cache ok.
			$index    = 0;

			foreach ( $messages as $message ) {
				if ( isset( $message['created_at'] ) ) {
					$messages[ $index ]['created_time'] = $message['created_at'];
					$messages[ $index ]['created_at']   = human_time_diff( strtotime( $message['created_at'] ), time() );
					$index++;
				}
			}
			return $messages;
		} catch ( \Exception $e ) {
			return array();
		}
	}

	/**
	 * SQL query to update emails
	 *
	 * @param int $message_id message id.
	 * @param int $key key.
	 * @param int $value value.
	 * @return void
	 * @since 1.0.0
	 */
	public static function update( $message_id, $key, $value ) {
		global $wpdb;
		$msg_table_name = $wpdb->prefix . MessageSchema::$table_name;
		$wpdb->update( $msg_table_name, array( $key => $value ), array( 'id' => $message_id ) ); // db call ok. no-cache ok.
	}
}
