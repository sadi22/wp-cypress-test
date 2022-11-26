<?php
/**
 * ContactGroupPivotModel class.
 *
 * @package Mint\MRM\DataBase\Models
 * @namespace Mint\MRM\DataBase\Models
 * @author [MRM Team]
 * @email [support@rextheme.com]
 * @create date 2022-08-09 11:03:17
 * @modify date 2022-08-09 11:03:17
 */

namespace Mint\MRM\DataBase\Models;

use Mint\MRM\DataBase\Tables\ContactGroupPivotSchema;
use Mint\MRM\DataBase\Tables\ContactSchema;
use Mint\Mrm\Internal\Traits\Singleton;

/**
 * ContactGroupPivotModel class
 *
 * Manage contact and group relationship related database operations.
 *
 * @package Mint\MRM\DataBase\Models
 * @namespace Mint\MRM\DataBase\Models
 *
 * @version 1.0.0
 */
class ContactGroupPivotModel {

	use Singleton;


	/**
	 * Run SQL query to insert contact and groups relation
	 *
	 * @param array $pivot_ids get all the ids.
	 *
	 * @return bool
	 * @since 1.0.0
	 */
	public static function add_groups_to_contact( $pivot_ids ) {
		global $wpdb;
		$table_name = $wpdb->prefix . ContactGroupPivotSchema::$table_name;

		try {
			foreach ( $pivot_ids as $id ) {
				$wpdb->insert(
					$table_name,
					array(
						'contact_id' => $id['contact_id'],
						'group_id'   => $id['group_id'],
						'created_at' => current_time( 'mysql' ),
					)
				); // db call ok.
			}
			return true;
		} catch ( \Exception $e ) {
			return false;
		}
	}

	/**
	 * Returns list of contacts related to a group
	 *
	 * @param mixed $ids group ids.
	 * @param int   $offset offset per batch.
	 * @param int   $per_batch per batch count.
	 *
	 * @return array
	 * @since 1.0.0
	 */
	public static function get_contacts_to_group( $ids, $offset = 0, $per_batch = 0 ) {
		global $wpdb;
		$pivot_table = $wpdb->prefix . ContactGroupPivotSchema::$table_name;

		if ( is_array( $ids ) ) {
			$ids = ! empty( $ids ) ? implode( ', ', $ids ) : 0;
		}

		try {
			// phpcs:disable WordPress.DB.PreparedSQL.InterpolatedNotPrepared -- Ignored for allowing interpolation in IN query.
			$select_query = $wpdb->prepare( "SELECT DISTINCT `contact_id` FROM {$pivot_table} WHERE `group_id` IN( %s )", $ids );
			// phpcs:enable WordPress.DB.PreparedSQL.InterpolatedNotPrepared.ARRAY_A

			if ( $per_batch ) {
				$select_query = $wpdb->prepare( '%s LIMIT %d, %d', $select_query, $offset, $per_batch );
			}
			$select_query = str_replace( '( \'', '( ', $select_query );
			$select_query = str_replace( '\' )', ' )', $select_query );
			// phpcs:disable WordPress.DB.PreparedSQL.NotPrepared
			return $wpdb->get_results( $select_query ); // db call ok. ; no-cache ok.
			// phpcs:enable WordPress.DB.PreparedSQL.NotPrepared
		} catch ( \Exception $e ) {
			return false;
		}
	}


	/**
	 * Run SQL query to delete contacts and groups relation from pivot table
	 *
	 * @param mixed $contact_id individual contact id.
	 * @param mixed $groups all group ids to delete.
	 *
	 * @return bool
	 * @since 1.0.0
	 */
	public static function delete_groups_to_contact( $contact_id, $groups ) {
		global $wpdb;
		$pivot_table = $wpdb->prefix . ContactGroupPivotSchema::$table_name;
		$groups      = implode( ',', array_map( 'intval', $groups ) );
		try {
			return $wpdb->query( "DELETE FROM $pivot_table WHERE contact_id = $contact_id AND group_id IN ($groups)" ); // db call ok. ; no-cache ok.
		} catch ( \Exception $e ) {
			return false;
		}
		return true;
	}


	/**
	 * Run SQL Query to get group ids related to a contact
	 *
	 * @param mixed $contact_id contact id to get groups.
	 *
	 * @return array
	 * @since 1.0.0
	 */
	public static function get_groups_to_contact( $contact_id ) {
		global $wpdb;
		$pivot_table = $wpdb->prefix . ContactGroupPivotSchema::$table_name;

		try {
			$select_query = $wpdb->prepare( "SELECT group_id FROM $pivot_table WHERE contact_id = %d", array( $contact_id ) );
			// phpcs:disable WordPress.DB.PreparedSQL.NotPrepared
			return $wpdb->get_results( $select_query ); // db call ok. ; no-cache ok.
			// phpcs:enable WordPress.DB.PreparedSQL.NotPrepared
		} catch ( \Exception $e ) {
			return false;
		}
	}


	/**
	 * Returns list of contacts related to a group
	 *
	 * @param array $groups group ids.
	 * @param int   $offset offset of the data.
	 * @param int   $limit limit of the data.
	 *
	 * @return array
	 * @since 1.0.0
	 */
	public static function get_contacts_to_campaign( $groups, $offset, $limit ) {
		global $wpdb;
		$pivot_table   = $wpdb->prefix . ContactGroupPivotSchema::$table_name;
		$contact_table = $wpdb->prefix . ContactSchema::$table_name;

		try {
			$groups       = implode( ',', array_map( 'intval', $groups ) );
			$select_query = $wpdb->prepare(
				"SELECT *
                                                FROM $contact_table
                                                INNER JOIN $pivot_table 
                                                    ON $pivot_table.contact_id = wp_mrm_contacts.id 
                                            WHERE $pivot_table.group_id in ($groups) LIMIT $offset, $limit"
			);
			// phpcs:disable WordPress.DB.PreparedSQL.NotPrepared
			$query_results = $wpdb->get_results( $select_query ); // db call ok. ; no-cache ok.
			// phpcs:enable WordPress.DB.PreparedSQL.NotPrepared 
			return $query_results;
		} catch ( \Exception $e ) {
			return false;
		}
	}


	/**
	 * Returns list of contacts related to a group
	 *
	 * @param mixed $groups group ids.
	 *
	 * @return int
	 * @since 1.0.0
	 */
	public static function get_contacts_count_to_campaign( $groups ) {
		global $wpdb;
		$pivot_table   = $wpdb->prefix . ContactGroupPivotSchema::$table_name;
		$contact_table = $wpdb->prefix . ContactSchema::$table_name;

		try {
			$groups       = implode( ',', array_map( 'intval', $groups ) );
			$select_query = $wpdb->prepare(
				"SELECT COUNT(*) as total
                                                FROM $contact_table
                                                INNER JOIN $pivot_table 
                                                    ON $pivot_table.contact_id = wp_mrm_contacts.id 
                                            WHERE $pivot_table.group_id in ($groups)"
			);
			// phpcs:disable WordPress.DB.PreparedSQL.NotPrepared
			$query_results = $wpdb->get_results( $select_query ); // db call ok. ; no-cache ok.
			// phpcs:enable WordPress.DB.PreparedSQL.NotPrepared 
			$count = intval( $query_results[0]->total );
			return $count;
		} catch ( \Exception $e ) {
			return false;
		}
	}
}
