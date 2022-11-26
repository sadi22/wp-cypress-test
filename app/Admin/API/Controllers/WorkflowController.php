<?php
/**
 * REST API Workflow Controller
 *
 * Handles requests to the workflows endpoint.
 *
 * @author   MRM Team
 * @category API
 * @package  MRM
 * @since    1.0.0
 */

namespace Mint\MRM\Admin\API\Controllers;

use Mint\MRM\DataBase\Models\WorkflowModel;
use Mint\Mrm\Internal\Traits\Singleton;
use WP_REST_Request;
use Exception;
use MRM\Data\MRM_Workflow;
use MRM\Common\MRM_Common;

/**
 * This is the main class that controls the workflows feature. Its responsibilities are:
 *
 * - Create or update a workflow
 * - Delete single or multiple workflows
 * - Retrieve single or multiple workflows
 *
 * @package Mint\MRM\Admin\API\Controllers
 */
class WorkflowController extends BaseController {

	use Singleton;

	/**
	 * Get and send response to create a new tag
	 *
	 * @param WP_REST_Request $request Request object used to generate the response.
	 * @return JSON
	 * @since 1.0.0
	 */
	public function create_or_update( WP_REST_Request $request ) {

		// Get values from API.
		$params = MRM_Common::get_api_params_values( $request );

		// Workflow title validation.
		$title = isset( $params['title'] ) ? sanitize_text_field( $params['title'] ) : null;

		if ( empty( $title ) ) {
			$response = __( 'Title is mandatory', 'mrm' );
			return $this->get_error_response( $response, 400 );
		}

		// Workflow object create and insert or update to database.
		try {

			// Workflow avaiability check.
			$exist = WorkflowModel::is_workflow_exist( $params['workflow_id'], 1 );

			$workflow = new MRM_Workflow( $params );

			if ( isset( $params['workflow_id'] ) ) {
				$success = WorkflowModel::update( $workflow, $params['workflow_id'] );
			} else {
				$success = WorkflowModel::insert( $workflow, 1 );
			}

			if ( $success ) {
				return $this->get_success_response( __( 'Workflow has been saved successfully', 'mrm' ), 201 );
			}
			return $this->get_error_response( __( 'Failed to save', 'mrm' ), 400 );
		} catch ( Exception $e ) {
				return $this->get_error_response( __( 'Workflow is not valid', 'mrm' ), 400 );
		}
	}


	/**
	 * Delete request for workflows
	 *
	 * @param WP_REST_Request $request Request object used to generate the response.
	 * @return WP_REST_Response|WP_Error
	 * @since 1.0.0
	 */
	public function delete_single( WP_REST_Request $request ) {

		// Get values from API.
		$params = MRM_Common::get_api_params_values( $request );

		// workflow avaiability check.
		$exist = WorkflowModel::is_workflow_exist( $params['workflow_id'] );

		if ( ! $exist ) {
			$response = __( 'Workflow not found', 'mrm' );
			return $this->get_error_response( $response, 400 );
		}

		$success = WorkflowModel::destroy( $params['workflow_id'] );
		if ( $success ) {
			return $this->get_success_response( __( 'Workflow has been deleted successfully', 'mrm' ), 200 );
		}

		return $this->get_error_response( __( 'Failed to delete', 'mrm' ), 400 );
	}



	/**
	 * Delete multiple workflows
	 *
	 * @param WP_REST_Request $request Request object used to generate the response.
	 * @return WP_REST_Response|WP_Error
	 * @since 1.0.0
	 */
	public function delete_all( WP_REST_Request $request ) {

		// Get values from API.
		$params = MRM_Common::get_api_params_values( $request );

		$success = WorkflowModel::destroy_all( $params['workflow_ids'] );
		if ( $success ) {
			return $this->get_success_response( __( 'Workflows have been deleted successfully', 'mrm' ), 200 );
		}

		return $this->get_error_response( __( 'Failed to delete', 'mrm' ), 400 );
	}


	/**
	 * Get all workflows request for workflows
	 *
	 * @param WP_REST_Request $request Request object used to generate the response.
	 * @return WP_REST_Response|WP_Error
	 * @since 1.0.0
	 */
	public function get_all( WP_REST_Request $request ) {

		// Get values from API.
		$params = MRM_Common::get_api_params_values( $request );

		$page     = isset( $params['page'] ) ? $params['page'] : 1;
		$per_page = isset( $params['per-page'] ) ? $params['per-page'] : 25;
		$offset   = ( $page - 1 ) * $per_page;

		// Tag Search keyword.
		$search = isset( $params['search'] ) ? sanitize_text_field( $params['search'] ) : '';

		$groups = WorkflowModel::get_all( $offset, $per_page, $search );

		if ( isset( $groups ) ) {
			return $this->get_success_response( __( 'Query Successfull', 'mrm' ), 200, $groups );
		}
		return $this->get_error_response( __( 'Failed to get data', 'mrm' ), 400 );
	}


	/**
	 * Function used to handle a single get request
	 *
	 * @param WP_REST_Request $request Request object used to generate the response.
	 * @return WP_REST_Response|WP_Error
	 * @since 1.0.0
	 */
	public function get_single( WP_REST_Request $request ) {

		// Get values from API.
		$params = MRM_Common::get_api_params_values( $request );

		$group = WorkflowModel::get( $params['workflow_id'] );

		if ( isset( $group ) ) {
			return $this->get_success_response( 'Query Successfull', 200, $group );
		}
		return $this->get_error_response( 'Failed to Get Data', 400 );
	}

}
