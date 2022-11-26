<?php
/**
 * REST API Form Controller
 *
 * Handles requests to the forms endpoint.
 *
 * @author   MRM Team
 * @category API
 * @package  MRM
 * @since    1.0.0
 */

namespace Mint\MRM\Admin\API\Controllers;

use Exception;
use Mint\MRM\DataBase\Models\FormModel;
use Mint\MRM\DataStores\FormData;
use Mint\Mrm\Internal\Traits\Singleton;
use WP_REST_Request;
use MRM\Common\MRM_Common;

/**
 * This is the main class that controls the forms feature. Its responsibilities are:
 *
 * - Create or update a form
 * - Delete single or multiple forms
 * - Retrieve single or multiple forms
 *
 * @package Mint\MRM\Admin\API\Controllers
 */
class FormController extends BaseController {

	use Singleton;

	/**
	 * Form object arguments
	 *
	 * @var object
	 * @since 1.0.0
	 */
	public $args;

	/**
	 * Remote API url for form templates
	 *
	 * @var string
	 * @since 1.0.0
	 */
	public static $form_templates_remote_api_url = 'https://d-aardvark-fufe.instawp.xyz/wp-json/mha/v1/forms';


	/**
	 * Function used to handle create  or update requests
	 *
	 * @param WP_REST_Request $request Request object used to generate the response.
	 *
	 * @return WP_REST_RESPONSE
	 * @since 1.0.0
	 */
	public function create_or_update( WP_REST_Request $request ) {

		// Get values from the API request.
		$params = MRM_Common::get_api_params_values( $request );

		// Form title validation.
		$title = isset( $params['title'] ) ? sanitize_text_field( $params['title'] ) : null;
		if ( empty( $title ) ) {
			return $this->get_error_response( __( 'Form name is mandatory', 'mrm' ), 200 );
		}

		if ( strlen( $title ) > 150 ) {
			return $this->get_error_response( __( 'Form title character limit exceeded 150 characters', 'mrm' ), 200 );
		}

		// Form object create and insert or update to database.
		$this->args = array(
			'title'         => $title,
			'form_body'     => isset( $params['form_body'] ) ? $params['form_body'] : '',
			'form_position' => isset( $params['form_position'] ) ? $params['form_position'] : '',
			'status'        => isset( $params['status'] ) ? $params['status'] : '',
			'group_ids'     => isset( $params['group_ids'] ) ? $params['group_ids'] : array(),
			'meta_fields'   => isset( $params['meta_fields'] ) ? $params['meta_fields'] : array(),
		);

		try {
			$form = new FormData( $this->args );

			if ( isset( $params['form_id'] ) ) {
				$success = FormModel::update( $form, $params['form_id'], 'forms' );
			} else {
				$success = FormModel::insert( $form, 'forms' );
			}

			if ( $success ) {
				return $this->get_success_response( __( 'Form has been saved successfully', 'mrm' ), 201, $success );
			}
			return $this->get_error_response( __( 'Failed to save', 'mrm' ), 200 );
		} catch ( Exception $e ) {
			return $this->get_error_response( __( 'Form is not valid', 'mrm' ), 200 );
		}
	}



	/**
	 * Function used to handle paginated get and search requests
	 *
	 * @param WP_REST_Request $request Request object used to generate the response.
	 * @return WP_REST_Response
	 * @since 1.0.0
	 */
	public function get_all( WP_REST_Request $request ) {

		// Get values from API.
		$params = MRM_Common::get_api_params_values( $request );

		$page     = isset( $params['page'] ) ? absint( $params['page'] ) : 1;
		$per_page = isset( $params['per-page'] ) ? absint( $params['per-page'] ) : 25;
		$offset   = ( $page - 1 ) * $per_page;

		$order_by   = isset( $params['order-by'] ) ? strtolower( $params['order-by'] ) : 'id';
		$order_type = isset( $params['order-type'] ) ? strtolower( $params['order-type'] ) : 'desc';

		// valid order by fields and types.
		$allowed_order_by_fields = array( 'title', 'created_at' );
		$allowed_order_by_types  = array( 'asc', 'desc' );

		// validate order by fields or use default otherwise.
		$order_by   = in_array( $order_by, $allowed_order_by_fields, true ) ? $order_by : 'id';
		$order_type = in_array( $order_type, $allowed_order_by_types, true ) ? $order_type : 'desc';

		// Form Search keyword.
		$search = isset( $params['search'] ) ? sanitize_text_field( $params['search'] ) : '';

		$forms = FormModel::get_all( $offset, $per_page, $search, $order_by, $order_type );

		// Prepare human_time_diff for every form.
		if ( isset( $forms['data'] ) ) {
			$forms['data'] = array_map(
				function( $form ) {
					if ( isset( $form['created_at'] ) ) {
						$form['created_ago'] = human_time_diff( strtotime( $form['created_at'] ), time() );
					}
					return $form;
				},
				$forms['data']
			);
		}

		if ( isset( $forms ) ) {
			return $this->get_success_response( __( 'Query Successfull', 'mrm' ), 200, $forms );
		}
		return $this->get_error_response( __( 'Failed to get data', 'mrm' ), 400 );
	}


	/**
	 * Function used to handle paginated get all forms only title and id
	 *
	 * @param WP_REST_Request $request Request object used to generate the response.
	 * @return WP_REST_Response
	 * @since 1.0.0
	 */
	public function get_all_id_title( WP_REST_Request $request ) {

		// Get values from API.
		$params = MRM_Common::get_api_params_values( $request );

		$forms = FormModel::get_all_id_title();

		$form_data = array();
		$list_none = array(
			'value' => 0,
			'label' => 'None',
		);
		array_push( $form_data, $list_none );

		foreach ( $forms['data'] as $form ) {
			$forms_ob = array(
				'value' => $form['id'],
				'label' => $form['title'],
			);
			array_push( $form_data, $forms_ob );
		}

		if ( isset( $forms ) ) {
			return $this->get_success_response( __( 'Query Successfull', 'mrm' ), 200, $form_data );
		}
		return $this->get_error_response( __( 'Failed to get data', 'mrm' ), 400 );
	}


	/**
	 * Function used to handle a single get request
	 *
	 * @param WP_REST_Request $request Request object used to generate the response.
	 * @return WP_REST_Response
	 * @since 1.0.0
	 */
	public function get_single( WP_REST_Request $request ) {

		// Get values from API.
		$params = MRM_Common::get_api_params_values( $request );

		$form = FormModel::get( $params['form_id'] );

		$form['group_ids'] = maybe_unserialize( $form['group_ids'] );

		if ( isset( $form['created_at'] ) ) {
			$form['created_ago'] = human_time_diff( strtotime( $form['created_at'] ), time() );
		}

		if ( isset( $form ) ) {
			return $this->get_success_response( __( 'Query Successful.', 'mrm' ), 200, $form );
		}
		return $this->get_error_response( __( 'Failed to get data.', 'mrm' ), 400 );
	}


	/**
	 * Function used to handle delete single form requests
	 *
	 * @param WP_REST_Request $request Request object used to generate the response.
	 * @return WP_REST_Response
	 * @since 1.0.0
	 */
	public function delete_single( WP_REST_Request $request ) {
		// Get values from API.
		$params = MRM_Common::get_api_params_values( $request );

		if ( isset( $params['form_id'] ) ) {
			$success = FormModel::destroy( $params['form_id'] );
			if ( $success ) {
				return $this->get_success_response( __( 'Form has been deleted successfully', 'mrm' ), 200 );
			}
		}

		return $this->get_error_response( __( 'Failed to delete', 'mrm' ), 400 );
	}


	/**
	 * Function used to handle delete requests
	 *
	 * @param WP_REST_Request $request Request object used to generate the response.
	 * @return WP_REST_Response
	 * @since 1.0.0
	 */
	public function delete_all( WP_REST_Request $request ) {
		// Get values from API.
		$params = MRM_Common::get_api_params_values( $request );

		if ( isset( $params['form_ids'] ) ) {
			$success = FormModel::destroy_all( $params['form_ids'] );
			if ( $success ) {
				return $this->get_success_response( __( 'Forms has been deleted successfully', 'mrm' ), 200 );
			}
		}

		return $this->get_error_response( __( 'Failed to delete', 'mrm' ), 400 );
	}


	/**
	 * Function used to handle update status requests
	 *
	 * @param WP_REST_Request $request Request object used to generate the response.
	 *
	 * @return WP_REST_RESPONSE
	 * @since 1.0.0
	 */
	public function form_status_update( WP_REST_Request $request ) {

		// Get values from the API request.
		$params = MRM_Common::get_api_params_values( $request );

		// Form object create and insert or update to database.
		$this->args = array(
			'status' => isset( $params['status'] ) ? $params['status'] : '',
		);
		try {
			$form    = new FormData( $this->args );
			$success = FormModel::form_status_update( $form, $params['form_id'] );

			if ( $success ) {
				return $this->get_success_response( __( 'Form status successfully updated', 'mrm' ), 201, $success );
			}
			return $this->get_error_response( __( 'Failed to save', 'mrm' ), 200 );
		} catch ( Exception $e ) {
			return $this->get_error_response( __( 'Form is not valid', 'mrm' ), 200 );
		}
	}



	/**
	 * Function used to get settings of a single form
	 *
	 * @param WP_REST_Request $request Request object used to generate the response.
	 * @return WP_REST_Response
	 * @since 1.0.0
	 */
	public function get_form_settings( WP_REST_Request $request ) {

		// Get values from API.
		$params = MRM_Common::get_api_params_values( $request );

		$form = FormModel::get_form_settings( $params['form_id'] );

		if ( isset( $form ) ) {
			return $this->get_success_response( __( 'Query Successful.', 'mrm' ), 200, $form );
		}
		return $this->get_error_response( __( 'Failed to get data.', 'mrm' ), 400 );
	}


	/**
	 * Function used to get title status and group form a single form
	 *
	 * @param WP_REST_Request $request Request object used to generate the response.
	 * @return WP_REST_Response
	 * @since 1.0.0
	 */
	public function get_title_group( WP_REST_Request $request ) {

		// Get values from API.
		$params = MRM_Common::get_api_params_values( $request );

		$form = FormModel::get_title_group( $params['form_id'] );

		$form[0]['group_ids'] = isset( $form[0]['group_ids'] ) ? maybe_unserialize( $form[0]['group_ids'] ) : array();

		if ( isset( $form ) ) {
			return $this->get_success_response( __( 'Query Successful.', 'mrm' ), 200, $form );
		}
		return $this->get_error_response( __( 'Failed to get data.', 'mrm' ), 400 );
	}

	/**
	 * Function used to get body of a single form
	 *
	 * @param WP_REST_Request $request Request object used to generate the response.
	 * @return WP_REST_Response
	 * @since 1.0.0
	 */
	public function get_form_body( WP_REST_Request $request ) {

		// Get values from API.
		$params = MRM_Common::get_api_params_values( $request );

		$form = FormModel::get_form_body( $params['form_id'] );

		if ( isset( $form ) ) {
			return $this->get_success_response( __( 'Query Successful.', 'mrm' ), 200, $form );
		}
		return $this->get_error_response( __( 'Failed to get data.', 'mrm' ), 400 );
	}



	/**
	 * Function used to get all form templates
	 *
	 * @param WP_REST_Request $request Request object used to generate the response.
	 * @return WP_REST_Response
	 * @since 1.0.0
	 */
	public function get_form_templates( WP_REST_Request $request ) {
		// Get values from API request.
		$params = MRM_Common::get_api_params_values( $request );

		$force_update = isset( $params['force_update'] ) ? $params['force_update'] : '';

		$cache_key = 'mrm_form_templates_data_' . MRM_VERSION;

		// Get form templates transient data.
		$templates_data = apply_filters( 'mrm_form_templates_data', get_transient( $cache_key ) );

		// Set transient for form templates.
		if ( $force_update || false === $templates_data ) {
			$timeout = ( $force_update ) ? 40 : 55;

			$api_url  = self::get_form_templates_remote_api_url();
			$response = self::remote_get(
				$api_url,
				array(
					'timeout' => $timeout,
				)
			);

			if ( isset( $response['success'] ) && true === $response['success'] ) {
				if ( isset( $response['data'] ) && ! empty( $response['data'] ) ) {
					set_transient( $cache_key, $response['data']['data'], 24 * HOUR_IN_SECONDS );
				}
			}
		}
		return rest_ensure_response( $templates_data );
	}


	/**
	 * Function used to call remote url and prepare response
	 *
	 * @param string $url Template URL.
	 * @param mixed  $args List of arguments.
	 * @return array
	 * @since 1.0.0
	 */
	private function remote_get( $url, $args ) {
		$response = wp_remote_get( $url, $args );
		if ( is_wp_error( $response ) || 200 !== (int) wp_remote_retrieve_response_code( $response ) ) {
			return array(
				'success' => false,
				'message' => $this->get_error_response( __( 'Failed to get data.', 'mrm' ), 400 ),
				'data'    => $response,
			);
		}
		return array(
			'success' => true,
			'message' => 'Data successfully retrieved',
			'data'    => json_decode( wp_remote_retrieve_body( $response ), true ),
		);
	}


	/**
	 * Function used to get remote API url for form templates
	 *
	 * @return string
	 * @since 1.0.0
	 */
	public static function get_form_templates_remote_api_url() {
		return self::$form_templates_remote_api_url;
	}

}
