<?php
/**
 * Manage Contact Groups Module related database operations.
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
use Mint\MRM\DataBase\Tables\ContactGroupSchema;
use Mint\Mrm\Internal\Traits\Singleton;

/**
 * ContactGroupModel class
 *
 * Manage Contact Groups Module related database operations.
 *
 * @package Mint\MRM\DataBase\Models
 * @namespace Mint\MRM\DataBase\Models
 *
 * @version 1.0.0
 */
class ContactGroupModel {

	use Singleton;

	/**
	 * Insert group information to database
	 *
	 * @param object $group Tag or List or Segment object.
	 * @param string $type group type.
	 *
	 * @return int|bool
	 * @since 1.0.0
	 */
	public static function insert( $group, $type ) {
		global $wpdb;
		$group_table = $wpdb->prefix . ContactGroupSchema::$table_name;

		try {
			$wpdb->insert(
				$group_table,
				array(
					'title'      => $group->get_title(),
					'type'       => $type,
					'slug'       => $group->get_slug(),
					'data'       => $group->get_data(),
					'created_at' => current_time( 'mysql' ),
				)
			); // db call ok.
			return $wpdb->insert_id;
		} catch ( \Exception $e ) {
			return false;
		}
	}


	/**
	 * Update group information to database
	 *
	 * @param object $group         Tag or List or Segment object.
	 * @param int    $id            Tag or List or Segment id.
	 * @param string $type          Tag or List or Segment type.
	 *
	 * @return bool
	 * @since 1.0.0
	 */
	public static function update( $group, $id, $type ) {
		global $wpdb;
		$group_table = $wpdb->prefix . ContactGroupSchema::$table_name;

		try {
			$wpdb->update(
				$group_table,
				array(
					'title'      => $group->get_title(),
					'type'       => $type,
					'slug'       => $group->get_slug(),
					'data'       => $group->get_data(),
					'updated_at' => current_time( 'mysql' ),
				),
				array( 'id' => $id )
			); // db call ok. ; no-cache ok.
			return true;
		} catch ( \Exception $e ) {
			return false;
		}
	}

	/**
	 * Run SQL query to get groups from database
	 *
	 * @param string $type     Tag or List or Segment type.
	 * @param int    $offset   offset.
	 * @param int    $limit    limit.
	 * @param string $search   search.
	 * @param string $order_by sorting order.
	 * @param string $order_type order type.
	 *
	 * @return array
	 * @since 1.0.0
	 */
	public static function get_all( $type, $offset = 0, $limit = 20, $search = '', $order_by = 'title', $order_type = 'ASC' ) {
		global $wpdb;
		$group_table  = $wpdb->prefix . ContactGroupSchema::$table_name;
		$pivot_table  = $wpdb->prefix . ContactGroupPivotSchema::$table_name;
		$search_terms = null;
		// Search groups by title.
		if ( ! empty( $search ) ) {
			$search       = $wpdb->esc_like( $search );
			$search_terms = "AND title LIKE '%%$search%%'";
		}

		// Return groups for list view.
		try {
			// phpcs:disable WordPress.DB.PreparedSQL.InterpolatedNotPrepared
			// phpcs:disable WordPress.DB.PreparedSQL.NotPrepared
			$select_query  = $wpdb->prepare(
				"SELECT count(group_id) as total_contacts, g.id, g.title, g.slug, g.data, g.created_at
            from $pivot_table as p right join $group_table as g
            on p.group_id = g.id
            where type = %s
            {$search_terms}
            group by g.id, g.title, g.data, g.created_at
            order by $order_by $order_type
            limit $offset, $limit",
				array( $type )
			);
			$query_results = $wpdb->get_results( $select_query ); // db call ok. ; no-cache ok.

			$count_query  = $wpdb->prepare(
				"SELECT COUNT(*) as total FROM (
                SELECT count(group_id) as total_contacts, g.id, g.title, g.slug, g.data, g.created_at
            from $pivot_table as p right join $group_table as g
            on p.group_id = g.id
            where type=%s
            {$search_terms}
            group by g.id, g.title, g.data, g.created_at
            ) as table1",
				array( $type )
			);
			$count_result = $wpdb->get_results( $count_query ); // db call ok. ; no-cache ok.

			$count       = (int) $count_result['0']->total;
			$total_pages = ceil( $count / $limit );
			return array(
				'data'        => $query_results,
				'total_pages' => $total_pages,
				'total_count' => $count,
			);
		} catch ( \Exception $e ) {
			return null;
		}
	}


	/**
	 * Run SQL query to get groups from database
	 *
	 * @param string $type     Tag or List or Segment type.
	 *
	 * @return array
	 * @since 1.0.0
	 */
	public static function get_all_to_custom_select( $type ) {
		global $wpdb;
		$group_table = $wpdb->prefix . ContactGroupSchema::$table_name;

		$results = $wpdb->get_results( $wpdb->prepare( "SELECT id, title FROM $group_table WHERE type = %s ORDER BY title ASC", array( $type ) ), ARRAY_A ); // db call ok. ; no-cache ok.
		return array(
			'data' => $results,
		);
	}


	/**
	 * Delete a group from the database
	 *
	 * @param mixed $id group id (tag_id, list_id, segment_id).
	 *
	 * @return bool
	 * @since 1.0.0
	 */
	public static function destroy( $id ) {
		global $wpdb;
		$group_table = $wpdb->prefix . ContactGroupSchema::$table_name;

		try {
			$wpdb->delete( $group_table, array( 'id' => $id ), array( '%d' ) ); // db call ok. ; no-cache ok.
			return true;
		} catch ( \Exception $e ) {
			return false;
		}
	}


	/**
	 * Delete multiple groups from the database
	 *
	 * @param array $ids multiple group ids (tag_id, list_id, segment_id).
	 *
	 * @return bool
	 * @since 1.0.0
	 */
	public static function destroy_all( $ids ) {
		global $wpdb;

		$group_table = $wpdb->prefix . ContactGroupSchema::$table_name;

		try {
			$ids = implode( ',', array_map( 'intval', $ids ) );
			$wpdb->query( "DELETE FROM {$group_table} WHERE id IN ($ids)" ); // db call ok. ; no-cache ok.
			return true;
		} catch ( \Exception $e ) {
			return false;
		}
	}


	/**
	 * Returns a single group data
	 *
	 * @param int $id Tag, List or Segment ID.
	 *
	 * @return array an array of results if successfull, NULL otherwise
	 * @since 1.0.0
	 */
	public static function get( $id ) {
		global $wpdb;
		$group_table = $wpdb->prefix . ContactGroupSchema::$table_name;

		try {
			$select_query  = $wpdb->prepare( "SELECT * FROM $group_table WHERE id = %d", array( $id ) );
			$select_result = $wpdb->get_results( $select_query ); // db call ok. ; no-cache ok.
			return $select_result;
		} catch ( \Exception $e ) {
			return false;
		}
	}


	/**
	 * Check existing tag, list or segment on database
	 *
	 * @param mixed  $slug group slug.
	 * @param string $type group type.
	 *
	 * @return bool
	 * @since 1.0.0
	 */
	public static function is_group_exist( $slug, $type ) {
		global $wpdb;
		$group_table = $wpdb->prefix . ContactGroupSchema::$table_name;

		$select_query  = $wpdb->prepare( "SELECT * FROM $group_table WHERE slug = %s AND type = %s", array( $slug, $type ) );
		$select_result = $wpdb->get_results( $select_query ); // db call ok. ; no-cache ok.
		if ( $select_result ) {
			return true;
		}
		return false;
	}


	/**
	 * Run SQL Query to get groups related to a contact
	 *
	 * @param mixed $group_ids group ids.
	 * @param mixed $type group type.
	 *
	 * @return array|bool
	 * @since 1.0.0
	 */
	public static function get_groups_to_contact( $group_ids, $type ) {
		global $wpdb;
		$table_name = $wpdb->prefix . ContactGroupSchema::$table_name;

		try {
			$groups       = implode( ',', array_map( 'intval', $group_ids ) );
			$select_query = $wpdb->prepare( "SELECT * FROM $table_name WHERE id IN ($groups) AND type = %s", array( $type ) );
			return $wpdb->get_results( $select_query ); // db call ok. ; no-cache ok.
		} catch ( \Exception $e ) {
			return false;
		}
	}


	/**
	 * Check existing tag, list or segment on database by id
	 *
	 * @param mixed $slug group slug.
	 * @param mixed $type group type.
	 * @param int   $id   group id.
	 *
	 * @return bool
	 * @since 1.0.0
	 */
	public static function is_group_exist_by_id( $slug, $type, $id ) {
		global $wpdb;
		$group_table = $wpdb->prefix . ContactGroupSchema::$table_name;

		$result = $wpdb->get_row( $wpdb->prepare( "SELECT * FROM $group_table WHERE slug = %s AND type = %s AND id= %d", array( $slug, $type, $id ) ) ); // db call ok. ; no-cache ok.
		if ( $result ) {
			return true;
		}
		return false;
	}


	/**
	 * Return contact groups count data
	 *
	 * @param mixed $type group type.
	 *
	 * @return int
	 * @since 1.0.0
	 */
	public static function get_groups_count( $type ) {
		global $wpdb;
		$group_table = $wpdb->prefix . ContactGroupSchema::$table_name;
		return absint( $wpdb->get_var( $wpdb->prepare( "SELECT COUNT(id) FROM $group_table WHERE type = %s", array( $type ) ) ) ); // db call ok. ; no-cache ok.
		// phpcs:enable WordPress.DB.PreparedSQL.InterpolatedNotPrepared
		// phpcs:enable WordPress.DB.PreparedSQL.NotPrepared
	}



}
