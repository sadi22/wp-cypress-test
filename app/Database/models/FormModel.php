<?php
/**
 * Manage contact form related databse operation.
 *
 * @package Mint\MRM\DataBase\Models
 * @namespace Mint\MRM\DataBase\Models
 * @author [MRM Team]
 * @email [support@rextheme.com]
 * @create date 2022-08-09 11:03:17
 * @modify date 2022-08-09 11:03:17
 */

namespace Mint\MRM\DataBase\Models;

use Error;
use Exception;
use Mint\MRM\DataBase\Tables\FormSchema;
use Mint\MRM\DataBase\Tables\FormMetaSchema;
use Mint\MRM\DataStores\FormData;
use MRM\Common\MRM_Common;
use Mint\Mrm\Internal\Traits\Singleton;

/**
 * FormModel class
 *
 * Manage contact form related databse operation.
 *
 * @package Mint\MRM\DataBase\Models
 * @namespace Mint\MRM\DataBase\Models
 *
 * @version 1.0.0
 */
class FormModel {

	use Singleton;

	/**
	 * Check existing form on database
	 *
	 * @param mixed $id Form id.
	 *
	 * @return bool
	 * @since 1.0.0
	 */
	public static function is_form_exist( $id ) {
		global $wpdb;
		$form_table = $wpdb->prefix . FormSchema::$table_name;
		// phpcs:disable WordPress.DB.PreparedSQL.InterpolatedNotPrepared
		$select_query = $wpdb->prepare( "SELECT * FROM $form_table WHERE id = %d", array( $id ) );
		// phpcs:enable WordPress.DB.PreparedSQL.InterpolatedNotPrepared
		// phpcs:disable WordPress.DB.PreparedSQL.NotPrepared
		$results = $wpdb->get_results( $select_query ); // db call ok. ; no-cache ok.
		// phpcs:enable WordPress.DB.PreparedSQL.NotPrepared

		if ( $results ) {
			return true;
		}
		return false;
	}

	/**
	 * SQL query to create a new form
	 *
	 * @param FormData $form form object.
	 * @return bool
	 * @since 1.0.0
	 */
	public static function insert( FormData $form ) {
		global $wpdb;
		$form_table = $wpdb->prefix . FormSchema::$table_name;

		try {
			$wpdb->insert(
				$form_table,
				array(
					'title'         => $form->get_title(),
					'form_body'     => $form->get_form_body(),
					'form_position' => $form->get_form_position(),
					'status'        => $form->get_status(),
					'group_ids'     => $form->get_group_ids(),
					'created_by'    => $form->get_created_by(),
					'template_id'   => $form->get_template_id(),
					'created_at'    => current_time( 'mysql' ),
				)
			); // db call ok. ; no-cache ok.

			$insert_id = ! empty( $wpdb->insert_id ) ? $wpdb->insert_id : '';

			if ( ! empty( $form->get_meta_fields() && ! empty( $insert_id ) ) ) {
				$meta_fields['meta_fields'] = $form->get_meta_fields();
				self::update_meta_fields( $insert_id, $meta_fields );
			}

			return $insert_id;
		} catch ( Exception $e ) {
			return false;
		}
	}


	/**
	 * SQL query to update a form
	 *
	 * @param FormData $form Form object.
	 * @param int      $form_id Form id.
	 *
	 * @return bool
	 * @since 1.0.0
	 */
	public static function update( FormData $form, $form_id ) {
		global $wpdb;
		$form_table = $wpdb->prefix . FormSchema::$table_name;

		$args['title']         = ! empty( $form->get_title() ) ? $form->get_title() : '';
		$args['form_body']     = ! empty( $form->get_form_body() ) ? $form->get_form_body() : '';
		$args['form_position'] = ! empty( $form->get_form_position() ) ? $form->get_form_position() : '';
		$args['status']        = $form->get_status();
		$args['template_id']   = ! empty( $form->get_template_id() ? $form->get_template_id() : '' );
		$args['created_by']    = ! empty( $form->get_created_by() ? $form->get_created_by() : '' );
		$args['updated_at']    = current_time( 'mysql' );
		$args['meta_fields']   = $form->get_meta_fields();
		$args['group_ids']     = $form->get_group_ids();

		if ( ! empty( $args['meta_fields'] ) ) {
			self::update_meta_fields( $form_id, $args );
		}
		unset( $args['meta_fields'] );

		try {
			$wpdb->update(
				$form_table,
				$args,
				array( 'ID' => $form_id )
			); // db call ok. ; no-cache ok.
		} catch ( \Exception $e ) {
			return false;
		}
		return true;
	}

	/**
	 * Delete a form from the database
	 *
	 * @param mixed $id Form id.
	 *
	 * @return bool
	 * @since 1.0.0
	 */
	public static function destroy( $id ) {
		global $wpdb;
		$form_table = $wpdb->prefix . FormSchema::$table_name;

		if ( ! self::is_form_exist( $id ) ) {
			return false;
		}
		return $wpdb->delete( $form_table, array( 'id' => $id ) ); // db call ok. ; no-cache ok.
	}


	/**
	 * Delete multiple forms
	 *
	 * @param array $form_ids form id.
	 *
	 * @return bool
	 * @since 1.0.0
	 */
	public static function destroy_all( $form_ids ) {
		global $wpdb;
		$form_table = $wpdb->prefix . FormSchema::$table_name;
		if ( is_array( $form_ids ) && count( $form_ids ) > 0 ) {
			$forms_ids = implode( ',', array_map( 'intval', $form_ids ) );
			// phpcs:disable WordPress.DB.PreparedSQL.InterpolatedNotPrepared
			return $wpdb->query( "DELETE FROM $form_table WHERE id IN($forms_ids)" ); // db call ok. ; no-cache ok.
			// phpcs:enable WordPress.DB.PreparedSQL.InterpolatedNotPrepared
		}
		return false;
	}

	/**
	 * Run SQL query to get or search forms from database
	 *
	 * @param int    $offset offset.
	 * @param int    $limit limit.
	 * @param string $search search.
	 * @param string $order_by sorting order.
	 * @param string $order_type sorting order type.
	 * @return array
	 * @since 1.0.0
	 */
	public static function get_all( $offset = 0, $limit = 10, $search = '', $order_by = 'id', $order_type = 'DESC' ) {
		global $wpdb;
		$form_table   = $wpdb->prefix . FormSchema::$table_name;
		$search_terms = null;

		// Search form by title.
		if ( ! empty( $search ) ) {
			$search       = $wpdb->esc_like( $search );
			$search_terms = "WHERE title LIKE '%%$search%%'";
		}

		// Prepare sql results for list view.
		try {

			// Return forms in list view.
			// phpcs:disable WordPress.DB.PreparedSQL.InterpolatedNotPrepared
			$select_query = $wpdb->get_results( $wpdb->prepare( "SELECT `id`, `title`, `status`, `created_at` FROM $form_table {$search_terms} ORDER BY $order_by $order_type LIMIT %d, %d", array( $offset, $limit ) ), ARRAY_A ); // db call ok. ; no-cache ok.
			$count_query  = $wpdb->get_var( $wpdb->prepare( "SELECT COUNT(*) as total FROM $form_table" ) ); // db call ok. ; no-cache ok.
			// phpcs:enable WordPress.DB.PreparedSQL.InterpolatedNotPrepared

			$count       = (int) $count_query;
			$total_pages = ceil( $count / $limit );

			$results = array();

			foreach ( $select_query as $query_result ) {
				$q_id    = isset( $query_result['id'] ) ? $query_result['id'] : '';
				$entries = self::get_form_meta_value_with_key( $q_id, 'entries' );

				$results[] = ! empty( $entries ) ? array_merge( $query_result, $entries ) : $query_result;
			}

			return array(
				'data'        => $results,
				'total_pages' => $total_pages,
				'count'       => $count,
			);
		} catch ( \Exception $e ) {
			return null;
		}
	}


	/**
	 * Run SQL query to get or search forms id and title only
	 *
	 * @return array
	 * @since 1.0.0
	 */
	public static function get_all_id_title() {
		global $wpdb;
		$form_table = $wpdb->prefix . FormSchema::$table_name;

		// Prepare sql results for list view.
		try {
			// Return forms for a contact in list view.
			// phpcs:disable WordPress.DB.PreparedSQL.InterpolatedNotPrepared
			$select_query = $wpdb->get_results( $wpdb->prepare( "SELECT `id`,`title` FROM $form_table WHERE status = %s ORDER BY id DESC", array( 'published' ) ), ARRAY_A ); // db call ok. ; no-cache ok.
			// phpcs:enable WordPress.DB.PreparedSQL.InterpolatedNotPrepared
			return array(
				'data' => $select_query,
			);
		} catch ( \Exception $e ) {
			return null;
		}
	}

	/**
	 * Run SQL Query to get a single form information
	 *
	 * @param mixed $id Form ID.
	 *
	 * @return object
	 * @since 1.0.0
	 */
	public static function get( $id ) {
		global $wpdb;
		$form_table = $wpdb->prefix . FormSchema::$table_name;

		try {
			// phpcs:disable WordPress.DB.PreparedSQL.InterpolatedNotPrepared
			$form_query = $wpdb->prepare( "SELECT `id`, `title`, `group_ids`, `status`, `form_body` FROM $form_table WHERE id = %d", array( $id ) );
			// phpcs:enable WordPress.DB.PreparedSQL.InterpolatedNotPrepared
			// phpcs:disable WordPress.DB.PreparedSQL.NotPrepared
			$form_result = json_decode( wp_json_encode( $wpdb->get_results( $form_query ) ), true ); // db call ok. ; no-cache ok.
			// phpcs:enable WordPress.DB.PreparedSQL.NotPrepared

			foreach ( $form_result as $query_result ) {
				$q_id    = isset( $query_result['id'] ) ? $query_result['id'] : '';
				$entries = self::get_form_meta_value_with_key( $q_id, 'settings' );

				return ! empty( $entries ) ? array_merge( $query_result, $entries ) : $query_result;
			}
		} catch ( \Exception $e ) {
			return false;
		}
	}

	/**
	 * Update a form meta information
	 *
	 * @param mixed $form_id Form ID.
	 * @param mixed $args Entity and value to update.
	 *
	 * @return bool|void
	 * @since 1.0.0
	 */
	public static function update_meta_fields( $form_id, $args ) {
		global $wpdb;
		$form_meta_table = $wpdb->prefix . FormMetaSchema::$table_name;
		if ( isset( $args['meta_fields'] ) ) {
			foreach ( $args['meta_fields'] as $key => $value ) {
				if ( self::is_form_meta_exist( $form_id, $key ) ) {
					// phpcs:disable WordPress.DB.SlowDBQuery.slow_db_query_meta_value
					// phpcs:disable WordPress.DB.SlowDBQuery.slow_db_query_meta_key
					$wpdb->update(
						$form_meta_table,
						array(
							'meta_value' => $value,
						),
						array(
							'meta_key' => $key,
							'form_id'  => $form_id,
						)
					); // db call ok. ; no-cache ok.
				} else {
					$wpdb->insert(
						$form_meta_table,
						array(
							'form_id'    => $form_id,
							'meta_key'   => $key,
							'meta_value' => $value,
						)
					); // db call ok. ; no-cache ok.
					// phpcs:enable WordPress.DB.SlowDBQuery.slow_db_query_meta_value
					// phpcs:disable WordPress.DB.SlowDBQuery.slow_db_query_meta_key
				}
			}
		}
	}

	/**
	 * Returns form meta data
	 *
	 * @param int $id Form ID.
	 * @return array
	 * @since 1.0.0
	 */
	public static function get_meta( $id ) {
		global $wpdb;
		$forms_meta_table = $wpdb->prefix . FormMetaSchema::$table_name;
		// phpcs:disable WordPress.DB.PreparedSQL.InterpolatedNotPrepared
		$meta_query = $wpdb->prepare( "SELECT meta_key, meta_value FROM $forms_meta_table  WHERE form_id = %d", array( $id ) );
		// phpcs:enable WordPress.DB.PreparedSQL.InterpolatedNotPrepared
		// phpcs:disable WordPress.DB.PreparedSQL.NotPrepared
		$meta_results = json_decode( wp_json_encode( $wpdb->get_results( $meta_query ) ), true ); // db call ok; no-cache ok.
		// phpcs:enable WordPress.DB.PreparedSQL.NotPrepared

		$new_meta['meta_fields'] = array();
		foreach ( $meta_results as $result ) {
			$new_meta['meta_fields'][ $result['meta_key'] ] = $result['meta_value'];
		}

		return $new_meta;
	}

	/**
	 * Check existing form meta
	 *
	 * @param int    $form_id form id.
	 * @param string $key meta key.
	 *
	 * @return bool
	 * @since 1.0.0
	 */
	public static function is_form_meta_exist( $form_id, $key ) {
		global $wpdb;
		$table_name = $wpdb->prefix . FormMetaSchema::$table_name;

		try {
			// phpcs:disable WordPress.DB.PreparedSQL.InterpolatedNotPrepared
			$select_query = $wpdb->prepare( "SELECT * FROM $table_name WHERE form_id = %d AND meta_key=%s", array( $form_id, $key ) );
			// phpcs:enable WordPress.DB.PreparedSQL.InterpolatedNotPrepared
			// phpcs:disable WordPress.DB.PreparedSQL.NotPrepared
			$results = $wpdb->get_results( $select_query ); // db call ok. ; no-cache ok.
			// phpcs:enable WordPress.DB.PreparedSQL.NotPrepared
			if ( ! empty( $results ) ) {
				return true;
			}
		} catch ( \Throwable $th ) {
			return false;
		}
	}


	/**
	 * Get from meta value with meta key
	 *
	 * @param int    $form_id form id.
	 * @param string $meta_key meta key.
	 *
	 * @return bool
	 * @since 1.0.0
	 */
	public static function get_form_meta_value_with_key( $form_id, $meta_key ) {
		global $wpdb;
		$table_name = $wpdb->prefix . FormMetaSchema::$table_name;

		try {
			// phpcs:disable WordPress.DB.PreparedSQL.InterpolatedNotPrepared
			$select_query = $wpdb->prepare( "SELECT * FROM $table_name WHERE form_id = %d AND meta_key=%s", array( $form_id, $meta_key ) );
			// phpcs:enable WordPress.DB.PreparedSQL.InterpolatedNotPrepared
			// phpcs:disable WordPress.DB.PreparedSQL.NotPrepared
			$results = $wpdb->get_results( $select_query ); // db call ok. ; no-cache ok.
			// phpcs:enable WordPress.DB.PreparedSQL.NotPrepared

			$new_meta['meta_fields'] = array();

			if ( ! empty( $results ) ) {
				$new_meta['meta_fields'][ $results[0]->meta_key ] = $results[0]->meta_value;

				return $new_meta;
			}
		} catch ( \Throwable $th ) {
			return false;
		}
	}

	/**
	 * SQL query to update status for a form
	 *
	 * @param FormData $form Form object.
	 * @param int      $form_id Form id.
	 *
	 * @return bool
	 * @since 1.0.0
	 */
	public static function form_status_update( FormData $form, $form_id ) {
		global $wpdb;
		$form_table = $wpdb->prefix . FormSchema::$table_name;

		if ( '' !== $form->get_status() ) {
			$args['status'] = $form->get_status();
		} else {
			return false;
		}

		$args['updated_at'] = current_time( 'mysql' );

		try {
			$wpdb->update(
				$form_table,
				$args,
				array( 'ID' => $form_id )
			); // db call ok; no-cache ok.
		} catch ( \Exception $e ) {
			return false;
		}
		return true;
	}


	/**
	 * Run SQL query to get settings for a single form
	 *
	 * @param int $id form id.
	 * @return array
	 * @since 1.0.0
	 */
	public static function get_form_settings( $id ) {
		global $wpdb;

		// Prepare sql to get settings from meta table.
		try {
			$settings = self::get_form_meta_value_with_key( $id, 'settings' );

			return $settings;
		} catch ( \Exception $e ) {
			return null;
		}
	}


	/**
	 * Run SQL Query to get a single form information
	 *
	 * @param mixed $id Form ID.
	 *
	 * @return object
	 * @since 1.0.0
	 */
	public static function get_title_group( $id ) {
		global $wpdb;
		$form_table = $wpdb->prefix . FormSchema::$table_name;

		try {
			// phpcs:disable WordPress.DB.PreparedSQL.InterpolatedNotPrepared
			$form_query = $wpdb->prepare( "SELECT `id`, `title`, `group_ids` FROM $form_table WHERE id = %d", array( $id ) );
			// phpcs:enable WordPress.DB.PreparedSQL.InterpolatedNotPrepared
			// phpcs:disable WordPress.DB.PreparedSQL.NotPrepared
			$form_result = json_decode( wp_json_encode( $wpdb->get_results( $form_query ) ), true ); // db call ok; no-cache ok.
			// phpcs:enable WordPress.DB.PreparedSQL.NotPrepared

			return $form_result;
		} catch ( \Exception $e ) {
			return false;
		}
	}

	/**
	 * Run SQL Query to get a single form information
	 *
	 * @param mixed $id Form ID.
	 *
	 * @return object
	 * @since 1.0.0
	 */
	public static function get_form_body( $id ) {
		global $wpdb;
		$form_table = $wpdb->prefix . FormSchema::$table_name;

		try {
			// phpcs:disable WordPress.DB.PreparedSQL.InterpolatedNotPrepared
			$query = $wpdb->prepare( "SELECT `id`, `form_body` FROM $form_table WHERE id = %d", array( $id ) );
			// phpcs:enable WordPress.DB.PreparedSQL.InterpolatedNotPrepared
			// phpcs:disable WordPress.DB.PreparedSQL.NotPrepared
			$result = json_decode( wp_json_encode( $wpdb->get_results( $query ) ), true ); // db call ok. ; no-cache ok.
			// phpcs:enable WordPress.DB.PreparedSQL.NotPrepared

			return $result;
		} catch ( \Exception $e ) {
			return false;
		}
	}
}
