<?php
/**
 * Manage Custom Fields related database operations.
 *
 * @package Mint\MRM\DataBase\Models
 * @namespace Mint\MRM\DataBase\Models
 * @author [MRM Team]
 * @email [support@rextheme.com]
 * @create date 2022-08-09 11:03:17
 * @modify date 2022-08-09 11:03:17
 */

namespace Mint\MRM\DataBase\Models;

use Mint\MRM\DataBase\Tables\CustomFieldSchema;
use Mint\Mrm\Internal\Traits\Singleton;

/**
 * FormModel class
 *
 * Manage Custom Fields related database operations.
 *
 * @package Mint\MRM\DataBase\Models
 * @namespace Mint\MRM\DataBase\Models
 *
 * @version 1.0.0
 */
class CustomFieldModel {

	use Singleton;

	/**
	 * Insert fields information to database
	 *
	 * @param mixed $field Field object.
	 *
	 * @return int|bool
	 * @since 1.0.0
	 */
	public static function insert( $field ) {
		global $wpdb;
		$fields_table = $wpdb->prefix . CustomFieldSchema::$table_name;

		try {
			$wpdb->insert(
				$fields_table,
				array(
					'title'      => $field->get_title(),
					'slug'       => $field->get_slug(),
					'type'       => $field->get_type(),
					'meta'       => $field->get_meta(),
					'created_at' => current_time( 'mysql' ),
				)
			); // db call ok. ; no-cache ok.
			return $wpdb->insert_id;
		} catch ( \Exception $e ) {
			return false;
		}
	}


	/**
	 * Update fields information to database
	 *
	 * @param object $field Field object.
	 * @param int    $id Field ID.
	 * @return bool
	 * @since 1.0.0
	 */
	public static function update( $field, $id ) {
		global $wpdb;
		$fields_table = $wpdb->prefix . CustomFieldSchema::$table_name;

		try {
			$wpdb->update(
				$fields_table,
				array(
					'title'      => $field->get_title(),
					'slug'       => $field->get_slug(),
					'type'       => $field->get_type(),
					'meta'       => $field->get_meta(),
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
	 * Run SQL query to get fields from database
	 *
	 * @param int    $offset offset.
	 * @param int    $limit limiting value.
	 * @param string $search search parameter.
	 * @param string $order_by sorting order.
	 * @param string $order_type sorting order type.
	 * @return array
	 * @since 1.0.0
	 */
	public static function get_all( $offset = 0, $limit = 20, $search = '', $order_by = 'id', $order_type = 'DESC' ) {
		global $wpdb;
		$fields_table = $wpdb->prefix . CustomFieldSchema::$table_name;

		$search_terms = null;
		if ( ! empty( $search ) ) {
			$search       = $wpdb->esc_like( $search );
			$search_terms = "WHERE `title` LIKE '%%$search%%'";
		}
		// Return field froups for list view.
		// phpcs:disable WordPress.DB.PreparedSQL.InterpolatedNotPrepared
		$select_query = $wpdb->prepare( "SELECT * FROM $fields_table {$search_terms} ORDER BY %s %s  LIMIT %d, %d", $order_by, $order_type, $offset, $limit );
		// phpcs:enable WordPress.DB.PreparedSQL.InterpolatedNotPrepared
		// phpcs:disable WordPress.DB.PreparedSQL.NotPrepared
		$results = $wpdb->get_results( $select_query, ARRAY_A ); // db call ok. ; no-cache ok.
		// phpcs:enable WordPress.DB.PreparedSQL.NotPrepared
		return array(
			'data' => $results,
		);
	}




	/**
	 * Delete a field from the database
	 *
	 * @param mixed $id      Field ID.
	 *
	 * @return bool
	 * @since 1.0.0
	 */
	public static function destroy( $id ) {
		global $wpdb;
		$fields_table = $wpdb->prefix . CustomFieldSchema::$table_name;

		try {
			$wpdb->delete( $fields_table, array( 'id' => $id ), array( '%d' ) ); // db call ok. ; no-cache ok.
			return true;
		} catch ( \Exception $e ) {
			return false;
		}
	}


	/**
	 * Run SQL query to get a single field
	 *
	 * @param int $id   Field ID.
	 *
	 * @return object an object of results if successfull, NULL otherwise
	 * @since 1.0.0
	 */
	public static function get( $id ) {
		global $wpdb;
		$fields_table = $wpdb->prefix . CustomFieldSchema::$table_name;

		try {
			// phpcs:disable WordPress.DB.PreparedSQL.InterpolatedNotPrepared
			$select_query = $wpdb->prepare( "SELECT * FROM $fields_table WHERE id = %d", array( $id ) );
			// phpcs:enable WordPress.DB.PreparedSQL.InterpolatedNotPrepared
			// phpcs:disable WordPress.DB.PreparedSQL.NotPrepared
			$select_result = $wpdb->get_row( $select_query ); // db call ok. ; no-cache ok.
			// phpcs:enable WordPress.DB.PreparedSQL.NotPrepared
			return $select_result;
		} catch ( \Exception $e ) {
			return false;
		}
	}


	/**
	 * Check existing custom fields
	 *
	 * @param mixed $slug slug value.
	 *
	 * @return bool
	 * @since 1.0.0
	 */
	public static function is_field_exist( $slug ) {
		global $wpdb;
		$fields_table = $wpdb->prefix . CustomFieldSchema::$table_name;
		// phpcs:disable WordPress.DB.PreparedSQL.InterpolatedNotPrepared
		$select_query = $wpdb->prepare( "SELECT * FROM $fields_table WHERE slug = %s", array( $slug ) );
		// phpcs:enable WordPress.DB.PreparedSQL.InterpolatedNotPrepared
		// phpcs:disable WordPress.DB.PreparedSQL.NotPrepared
		$select_result = $wpdb->get_results( $select_query ); // db call ok. ; no-cache ok.
		// phpcs:enable WordPress.DB.PreparedSQL.NotPrepared
		if ( $select_result ) {
			return true;
		}
		return false;
	}

}
