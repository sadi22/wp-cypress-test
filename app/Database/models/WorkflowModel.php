<?php
/**
 * Handle Workflow Module database related operations.
 *
 * @package Mint\MRM\DataBase\Models
 * @namespace Mint\MRM\DataBase\Models
 * @author [MRM Team]
 * @email [support@rextheme.com]
 * @create date 2022-08-09 11:03:17
 * @modify date 2022-08-09 11:03:17
 */

namespace Mint\MRM\DataBase\Models;

use Mint\MRM\DataBase\Tables\WorkFlowSchema;
use Mint\MRM\DataStores\WordkflowData;
use Mint\Mrm\Internal\Traits\Singleton;

/**
 * WorkflowModel class
 *
 * Manage contact note related databse operation.
 *
 * @package Mint\MRM\DataBase\Models
 * @namespace Mint\MRM\DataBase\Models
 *
 * @version 1.0.0
 */
class WorkflowModel {


	use Singleton;


	/**
	 * Check existing workflow on database
	 *
	 * @param mixed $id workflow id.
	 *
	 * @return bool
	 * @since 1.0.0
	 */
	public static function is_workflow_exist( $id ) {
		global $wpdb;
		$table_name = $wpdb->prefix . WorkFlowSchema::$table_name;
		// phpcs:disable WordPress.DB.PreparedSQL.InterpolatedNotPrepared 
		$sql_count = $wpdb->prepare( "SELECT COUNT(*) as total FROM {$table_name} WHERE id = %d", array( $id ) );
		// phpcs:enable WordPress.DB.PreparedSQL.InterpolatedNotPrepared 
		// phpcs:disable WordPress.DB.PreparedSQL.NotPrepared 
		$sql_count_data = $wpdb->get_results( $sql_count ); // db call ok. ; no-cache ok.
		// phpcs:disable WordPress.DB.PreparedSQL.NotPrepared 
		$sql_count_data_json = json_decode( wp_json_encode( $sql_count_data ), true );
		$count               = (int) $sql_count_data_json['0']['total'];
		if ( $count ) {
			return true;
		}
		return false;
	}


	/**
	 * Insert workflow information to database
	 *
	 * @param WordkflowData $workflow workflow data.
	 *
	 * @return bool|int
	 * @since 1.0.0
	 */
	public static function insert( WordkflowData $workflow ) {
		global $wpdb;
		$table_name = $wpdb->prefix . WorkFlowSchema::$table_name;

		try {
			$wpdb->insert(
				$table_name,
				array(
					'title'         => $workflow->get_title(),
					'workflow_data' => $workflow->get_workflow_data(),
					'global_state'  => $workflow->get_global_state(),
					'status'        => $workflow->get_status(),
					'last_step_id'  => $workflow->get_last_step_id(),
				)
			); // db call ok. ; no-cache ok.
		} catch ( \Exception $e ) {
			return false;
		}
		return $wpdb->insert_id;
	}

	/**
	 * SQL query to update a workflow
	 *
	 * @param WordkflowData $workflow Workflow object.
	 * @param int           $workflow_id Workflow id.
	 *
	 * @return JSON
	 * @since 1.0.0
	 */
	public static function update( WordkflowData $workflow, $workflow_id ) {
		global $wpdb;
		$table = $wpdb->prefix . WorkFlowSchema::$table_name;

		try {
			$wpdb->update(
				$table,
				array(
					'title'         => $workflow->get_title(),
					'workflow_data' => $workflow->get_workflow_data(),
					'global_state'  => $workflow->get_global_state(),
					'status'        => $workflow->get_status(),
					'last_step_id'  => $workflow->get_last_step_id(),
				),
				array(
					'id' => $workflow_id,
				)
			); // db call ok. ; no-cache ok.
			return true;
		} catch ( \Exception $e ) {
			return false;
		}
	}


	/**
	 * Delete a workflow
	 *
	 * @param mixed $id workflow id workdflow id.
	 *
	 * @return bool
	 * @since 1.0.0
	 */
	public static function destroy( $id ) {
		global $wpdb;
		$table_name = $wpdb->prefix . WorkFlowSchema::$table_name;

		try {
			$wpdb->delete( $table_name, array( 'id' => $id ) ); // db call ok. ; no-cache ok.
		} catch ( \Exception $e ) {
			return false;
		}

		return true;
	}


	/**
	 * Delete multiple workflows
	 *
	 * @param array $workflow_ids workflow ids.
	 *
	 * @return bool
	 * @since 1.0.0
	 */
	public static function destroy_all( $workflow_ids ) {
		global $wpdb;
		$table_name = $wpdb->prefix . WorkFlowSchema::$table_name;

		try {
			$workflow_ids = implode( ',', array_map( 'absint', $workflow_ids ) );
			// phpcs:disable WordPress.DB.PreparedSQL.InterpolatedNotPrepared 
			$wpdb->query( "DELETE FROM $table_name WHERE id IN($workflow_ids)" ); // db call ok. ; no-cache ok.
			// phpcs:enable WordPress.DB.PreparedSQL.InterpolatedNotPrepared 
		} catch ( \Exception $e ) {
			return false;
		}
		return true;
	}


	/**
	 * Run SQL query to get or search workflows from database
	 *
	 * @param int    $offset offset.
	 * @param int    $limit limit.
	 * @param string $search search.
	 *
	 * @return array
	 * @since 1.0.0
	 */
	public static function get_all( $offset = 0, $limit = 10, $search = '' ) {
		global $wpdb;
		$table_name   = $wpdb->prefix . WorkFlowSchema::$table_name;
		$search_terms = null;

		// Search workflows by name.
		if ( ! empty( $search ) ) {
			$search_terms = "WHERE title LIKE '%" . $search . "%'";
		}

		// Prepare sql results for list view.
		try {
			$select_query = "SELECT * FROM {$table_name} {$search_terms} ORDER BY id DESC LIMIT {$offset}, {$limit}";

			$query_results = $wpdb->get_results( $select_query ); // db call ok. ; no-cache ok.
			$results       = json_decode( wp_json_encode( $query_results ), true );

			$count_query = "SELECT COUNT(*) as total FROM {$table_name} {$search_terms}";
			$count_data  = $wpdb->get_results( $count_query ); // db call ok. ; no-cache ok.
			$count_array = json_decode( wp_json_encode( $count_data ), true );

			$count       = (int) $count_array['0']['total'];
			$total_pages = ceil( intdiv( $count, $limit ) );

			return array(
				'data'        => $results,
				'total_pages' => $total_pages,
			);
		} catch ( \Exception $e ) {
			return null;
		}
	}


	/**
	 * Returns a single group data
	 *
	 * @param int $id Workflow id.
	 *
	 * @return array an array of results if successfull, NULL otherwise
	 * @since 1.0.0
	 */
	public static function get( $id ) {
		global $wpdb;
		$table_name = $wpdb->prefix . WorkFlowSchema::$table_name;

		try {
			// phpcs:disable WordPress.DB.PreparedSQL.InterpolatedNotPrepared
			$sql = $wpdb->prepare( "SELECT * FROM {$table_name} WHERE id = %d", array( $id ) );
			// phpcs:enable WordPress.DB.PreparedSQL.InterpolatedNotPrepared
			// phpcs:disable WordPress.DB.PreparedSQL.NotPrepared 
			$data = $wpdb->get_results( $sql ); // db call ok. ; no-cache ok.
			// phpcs:enable WordPress.DB.PreparedSQL.NotPrepared 
			$data_json = json_decode( wp_json_encode( $data ) );
			return $data_json;
		} catch ( \Exception $e ) {
			return false;
		}
	}

}
