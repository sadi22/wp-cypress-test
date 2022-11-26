<?php
/**
 * REST API Tag Controller
 *
 * Handles requests to the tags endpoint.
 *
 * @author   MRM Team
 * @category API
 * @package  MRM
 * @since    1.0.0
 */

namespace Mint\MRM\Admin\API\Controllers;

use Mint\MRM\DataBase\Models\ContactGroupModel;
use Mint\MRM\DataStores\TagData;
use Mint\Mrm\Internal\Traits\Singleton;
use WP_REST_Request;
use Exception;
use Mint\MRM\DataBase\Models\ContactModel;
use MRM\Common\MRM_Common;

/**
 * This is the main class that controls the tags feature. Its responsibilities are:
 *
 * - Create or update a tag
 * - Delete single or multiple tags
 * - Retrieve single or multiple tags
 * - Assign or removes tags and lists from the contact
 *
 * @package Mint\MRM\Admin\API\Controllers
 */
class TagController extends BaseController {

	use Singleton;

	/**
	 * Tag object arguments
	 *
	 * @var object
	 * @since 1.0.0
	 */
	public $args;

	/**
	 * Get and send response to create a new tag
	 *
	 * @param WP_REST_Request $request Request object used to generate the response.
	 * @return WP_REST_Response
	 * @since 1.0.0
	 */
	public function create_or_update( WP_REST_Request $request ) {

		// Get values from API.
		$params = MRM_Common::get_api_params_values( $request );

		// Tag title validation.
		$title = isset( $params['title'] ) ? sanitize_text_field( $params['title'] ) : null;

		if ( empty( $title ) ) {
			return $this->get_error_response( __( 'Tag name is mandatory', 'mrm' ), 200 );
		}

		if ( strlen( $title ) > 60 ) {
			return $this->get_error_response( __( 'Tag name is to long', 'mrm' ), 200 );
		}

		$slug = sanitize_title( $title );
		// Tag avaiability check.
		$exist = ContactGroupModel::is_group_exist( $slug, 'tags' );
		if ( $exist && ! isset( $params['tag_id'] ) ) {
			return $this->get_error_response( __( 'Tag is already available', 'mrm' ), 200 );
		}

		// Tag object create and insert or update to database.
		$this->args = array(
			'title' => $title,
			'slug'  => $slug,
			'data'  => isset( $params['data'] ) ? $params['data'] : '',
		);

		try {
			$tag = new TagData( $this->args );

			if ( isset( $params['tag_id'] ) ) {
				// Check slugs for removing the duplication of same name.
				$other_slugs = ContactGroupModel::is_group_exist( $slug, 'tags' );
				$update_slug = ContactGroupModel::is_group_exist_by_id( $slug, 'tags', $params['tag_id'] );
				if ( $other_slugs && ! $update_slug ) {
					return $this->get_error_response( __( 'Tag is already available', 'mrm' ), 200 );
				}
				$success = ContactGroupModel::update( $tag, $params['tag_id'], 'tags' );
			} else {
				$success = ContactGroupModel::insert( $tag, 'tags' );
			}

			if ( $success ) {
				return $this->get_success_response( __( 'Tag has been saved successfully', 'mrm' ), 201, $success );
			}
			return $this->get_error_response( __( 'Failed to save', 'mrm' ), 400 );
		} catch ( Exception $e ) {
			return $this->get_error_response( __( 'Tag is not valid', 'mrm' ), 400 );
		}
	}


	/**
	 * Delete request for tags
	 *
	 * @param WP_REST_Request $request Request object used to generate the response.
	 * @return WP_REST_Response
	 * @since 1.0.0
	 */
	public function delete_single( WP_REST_Request $request ) {

		// Get values from API.
		$params = MRM_Common::get_api_params_values( $request );

		$success = ContactGroupModel::destroy( $params['tag_id'] );
		if ( $success ) {
			return $this->get_success_response( __( 'Tag has been deleted successfully', 'mrm' ), 200 );
		}

		return $this->get_error_response( __( 'Failed to delete', 'mrm' ), 400 );
	}


	/**
	 * Delete multiple tags
	 *
	 * @param WP_REST_Request $request Request object used to generate the response.
	 * @return WP_REST_Response
	 * @since 1.0.0
	 */
	public function delete_all( WP_REST_Request $request ) {

		// Get values from API.
		$params = MRM_Common::get_api_params_values( $request );

		$success = ContactGroupModel::destroy_all( $params['tag_ids'] );
		if ( $success ) {
			return $this->get_success_response( __( 'Tags has been deleted successfully', 'mrm' ), 200 );
		}

		return $this->get_error_response( __( 'Failed to delete', 'mrm' ), 400 );
	}


	/**
	 * Get all tags request for tags
	 *
	 * @param WP_REST_Request $request Request object used to generate the response.
	 * @return WP_REST_Response
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

		$order_by   = isset( $params['order-by'] ) ? strtolower( $params['order-by'] ) : 'id';
		$order_type = isset( $params['order-type'] ) ? strtolower( $params['order-type'] ) : 'desc';

		// valid order by fields and types.
		$allowed_order_by_fields = array( 'title', 'created_at' );
		$allowed_order_by_types  = array( 'asc', 'desc' );

		// validate order by fields or use default otherwise.
		$order_by   = in_array( $order_by, $allowed_order_by_fields, true ) ? $order_by : 'id';
		$order_type = in_array( $order_type, $allowed_order_by_types, true ) ? $order_type : 'desc';

		$groups = ContactGroupModel::get_all( 'tags', $offset, $per_page, $search, $order_by, $order_type );
		// Count contacts groups.
		$groups['count_groups'] = array(
			'lists'    => ContactGroupModel::get_groups_count( 'lists' ),
			'tags'     => absint( $groups['total_count'] ),
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

		$group = ContactGroupModel::get( $params['tag_id'] );

		if ( isset( $group ) ) {
			return $this->get_success_response( __( 'Query Successfull', 'mrm' ), 200, $group );
		}
		return $this->get_error_response( __( 'Failed to get data', 'mrm' ), 400 );
	}


	/**
	 * Get all contacts related to specific tag
	 *
	 * @param WP_REST_Request $request Request object used to generate the response.
	 * @return WP_REST_Response
	 * @since 1.0.0
	 */
	public function get_contacts( WP_REST_Request $request ) {
		// Get values from API.
		$params = MRM_Common::get_api_params_values( $request );

		$contacts = ContactPivotController::get_contacts_to_group( $params['tag_id'] );

		if ( isset( $contacts ) ) {
			return $this->get_success_response( 'Query Successfull', 200, $contacts );
		}
		return $this->get_error_response( 'Failed to Get Data', 400 );
	}


	/**
	 * Add tags to new contact
	 *
	 * @param array $tags List of tags.
	 * @param int   $contact_id Contact Id.
	 *
	 * @return bool
	 * @since 1.0.0
	 */
	public static function set_tags_to_contact( $tags, $contact_id ) {
		$pivot_ids = array_map(
			function ( $tag ) use ( $contact_id ) {
				return array(
					'group_id'   => isset( $tag['id'] ) ? $tag['id'] : $tag,
					'contact_id' => $contact_id,
				);
			},
			$tags
		);
		return ContactPivotController::set_groups_to_contact( $pivot_ids );
	}



	/**
	 * Add tags to multiple contacts
	 *
	 * @param array $tags List of tags.
	 * @param mixed $contact_ids Contact Id.
	 *
	 * @return bool
	 * @since 1.0.0
	 */
	public static function set_tags_to_multiple_contacts( $tags, $contact_ids ) {
		$res = array_map(
			function ( $tag ) use ( $contact_ids ) {
				$pivot_ids = array_map(
					function ( $contact_id ) use ( $tag ) {
						return array(
							'group_id'   => $tag['id'],
							'contact_id' => $contact_id,
						);
					},
					$contact_ids
				);

				( ContactPivotController::set_groups_to_contact( $pivot_ids ) );
			},
			$tags
		);

		return $res;
	}


	/**
	 * Return tags which are assigned to a contact
	 *
	 * @param mixed $contact Single contact object.
	 *
	 * @return array
	 * @since 1.0.0
	 */
	public static function get_tags_to_contact( $contact ) {
		$contact_id      = isset( $contact['contact_id'] ) ? $contact['contact_id'] : $contact['id'];
		$contact['tags'] = array();
		$results         = ContactPivotController::get_instance()->get_groups_to_contact( $contact_id );

		if ( ! empty( $results ) ) {
			$tag_ids = array_map(
				function( $tag_id ) {
					return $tag_id['group_id'];
				},
				$results
			);

			$contact['tags'] = ContactGroupModel::get_groups_to_contact( $tag_ids, 'tags' );
		}

		return $contact;
	}


	/**
	 * Function used to return all tags to custom select dropdown
	 *
	 * @return WP_REST_Response
	 * @since 1.0.0
	 */
	public function get_all_to_custom_select() {
		$groups = ContactGroupModel::get_all_to_custom_select( 'tags' );

		if ( isset( $groups ) ) {
			return $this->get_success_response( __( 'Query Successfull', 'mrm' ), 200, $groups );
		}
		return $this->get_error_response( __( 'Failed to get data', 'mrm' ), 400 );
	}

}
