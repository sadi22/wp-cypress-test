<?php
/**
 * REST API List Controller
 *
 * Handles requests to the lists endpoint.
 *
 * @author   MRM Team
 * @category API
 * @package  MRM
 * @since    1.0.0
 */

namespace Mint\MRM\Admin\API\Controllers;

use Exception;
use Mint\MRM\DataBase\Models\ContactGroupModel;
use Mint\MRM\DataBase\Models\ContactModel;
use Mint\MRM\DataStores\ListData;
use Mint\Mrm\Internal\Traits\Singleton;
use WP_REST_Request;
use MRM\Common\MRM_Common;

/**
 * This is the main class that controls the lists feature. Its responsibilities are:
 *
 * - Create or update a list
 * - Delete single or multiple lists
 * - Retrieve single or multiple lists
 * - Assign or removes lists from the contact
 *
 * @package Mint\MRM\Admin\API\Controllers
 */
class ListController extends BaseController {

	use Singleton;

	/**
	 * List object arguments
	 *
	 * @var object
	 * @since 1.0.0
	 */
	public $args;


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

		// List title validation.
		$title = isset( $params['title'] ) ? sanitize_text_field( $params['title'] ) : null;
		if ( empty( $title ) ) {
			return $this->get_error_response( __( 'List name is mandatory', 'mrm' ), 200 );
		}

		if ( strlen( $title ) > 60 ) {
			return $this->get_error_response( __( 'List name is to long', 'mrm' ), 200 );
		}

		// List avaiability check.
		$slug  = sanitize_title( $title );
		$exist = ContactGroupModel::is_group_exist( $slug, 'lists' );
		if ( $exist && ! isset( $params['list_id'] ) ) {
			return $this->get_error_response( __( 'List is already available', 'mrm' ), 200 );
		}

		// List object create and insert or update to database.
		$this->args = array(
			'title' => $title,
			'slug'  => $slug,
			'data'  => isset( $params['data'] ) ? $params['data'] : '',
		);

		try {
			$list = new ListData( $this->args );

			if ( isset( $params['list_id'] ) ) {
				// Check slugs for removing the duplication of same name.
				$other_slugs = ContactGroupModel::is_group_exist( $slug, 'lists' );
				$update_slug = ContactGroupModel::is_group_exist_by_id( $slug, 'lists', $params['list_id'] );
				if ( $other_slugs && ! $update_slug ) {
					return $this->get_error_response( __( 'List is already available', 'mrm' ), 200 );
				}
				$success = ContactGroupModel::update( $list, $params['list_id'], 'lists' );
			} else {
				$success = ContactGroupModel::insert( $list, 'lists' );
			}

			if ( $success ) {
				return $this->get_success_response( __( 'List has been saved successfully', 'mrm' ), 201, $success );
			}
			return $this->get_error_response( __( 'Failed to save', 'mrm' ), 200 );
		} catch ( Exception $e ) {
			return $this->get_error_response( __( 'List is not valid', 'mrm' ), 200 );
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

		// List Search keyword.
		$search = isset( $params['search'] ) ? sanitize_text_field( $params['search'] ) : '';

		$groups = ContactGroupModel::get_all( 'lists', $offset, $per_page, $search, $order_by, $order_type );
		// Count contacts groups.
		$groups['count_groups'] = array(
			'lists'    => absint( $groups['total_count'] ),
			'tags'     => ContactGroupModel::get_groups_count( 'tags' ),
			'contacts' => ContactModel::get_contacts_count(),
			'segments' => ContactGroupModel::get_groups_count( 'segments' ),
		);
		if ( isset( $groups ) ) {
			return $this->get_success_response( __( 'Query Successfull', 'mrm' ), 200, $groups );
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

		$group = ContactGroupModel::get( $params['list_id'] );

		if ( isset( $group ) ) {
			return $this->get_success_response( __( 'Query Successful.', 'mrm' ), 200, $group );
		}
		return $this->get_error_response( __( 'Failed to get data.', 'mrm' ), 400 );
	}


	/**
	 * Function used to handle delete requests
	 *
	 * @param WP_REST_Request $request Request object used to generate the response.
	 * @return WP_REST_Response
	 * @since 1.0.0
	 */
	public function delete_single( WP_REST_Request $request ) {
		// Get values from API.
		$params = MRM_Common::get_api_params_values( $request );

		$success = ContactGroupModel::destroy( $params['list_id'] );
		if ( $success ) {
			return $this->get_success_response( __( 'List has been deleted successfully', 'mrm' ), 200 );
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

		$success = ContactGroupModel::destroy_all( $params['list_ids'] );
		if ( $success ) {
			return $this->get_success_response( __( 'Lists has been deleted successfully', 'mrm' ), 200 );
		}

		return $this->get_error_response( __( 'Failed to delete', 'mrm' ), 400 );
	}


	/**
	 * Add lists to new contact
	 *
	 * @param array $lists List of lists.
	 * @param int   $contact_id Contact ID.
	 *
	 * @return bool
	 * @since 1.0.0
	 */
	public static function set_lists_to_contact( $lists, $contact_id ) {
		$pivot_ids = array_map(
			function ( $list ) use ( $contact_id ) {
				return array(
					'group_id'   => isset( $list['id'] ) ? $list['id'] : $list,
					'contact_id' => $contact_id,
				);
			},
			$lists
		);
		return ContactPivotController::set_groups_to_contact( $pivot_ids );
	}

	/**
	 * Add lists to multiple contacts
	 *
	 * @param array $lists List of lists.
	 * @param mixed $contact_ids Contact IDs.
	 *
	 * @return bool
	 * @since 1.0.0
	 */
	public static function set_lists_to_multiple_contacts( $lists, $contact_ids ) {
		$res = array_map(
			function ( $list ) use ( $contact_ids ) {
				$pivot_ids = array_map(
					function ( $contact_id ) use ( $list ) {
						return array(
							'group_id'   => $list['id'],
							'contact_id' => $contact_id,
						);
					},
					$contact_ids
				);

				( ContactPivotController::set_groups_to_contact( $pivot_ids ) );
			},
			$lists
		);

		return $res;
	}



	/**
	 * Return lists which are assigned to a contact
	 *
	 * @param mixed $contact Single contact object.
	 *
	 * @return array
	 * @since 1.0.0
	 */
	public static function get_lists_to_contact( $contact ) {
		$contact_id       = isset( $contact['contact_id'] ) ? $contact['contact_id'] : $contact['id'];
		$contact['lists'] = array();
		$results          = ContactPivotController::get_instance()->get_groups_to_contact( $contact_id );

		if ( ! empty( $results ) ) {
			$list_ids = array_map(
				function( $list_id ) {
					return $list_id['group_id'];
				},
				$results
			);

			$contact['lists'] = ContactGroupModel::get_groups_to_contact( $list_ids, 'lists' );
		}

		return $contact;
	}


	/**
	 * Function used to return all list to custom select dropdown
	 *
	 * @return WP_REST_Response
	 * @since 1.0.0
	 */
	public function get_all_to_custom_select() {
		$groups = ContactGroupModel::get_all_to_custom_select( 'lists' );

		if ( isset( $groups ) ) {
			return $this->get_success_response( __( 'Query Successfull', 'mrm' ), 200, $groups );
		}
		return $this->get_error_response( __( 'Failed to get data', 'mrm' ), 400 );
	}

}
