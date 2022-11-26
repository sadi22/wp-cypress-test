<?php
/**
 * Mail Mint
 *
 * @author [MRM Team]
 * @email [support@rextheme.com]
 * @create date 2022-08-09 11:03:17
 * @modify date 2022-08-09 11:03:17
 * @package /app/API/
 */

namespace Mint\MRM\Admin\API;

use Mint\MRM\Admin\API\Controllers\MRM_Contact_Controller;
use Mint\MRM\Admin\API\Controllers\ProductController;
use Mint\Mrm\Internal\Traits\Singleton;

defined( 'ABSPATH' ) || exit;

/**
 * [Register REST API routes after plugin has been activated]]
 *
 * @desc Manage Campaign email builder related API
 * @package /app/API/Routes
 * @since 1.0.0
 */
class Server {

	use Singleton;

	/**
	 * REST API namespaces and endpoints.
	 *
	 * @var array
	 * @since 1.0.0
	 */
	protected $routes = array();


	/**
	 * Hook into WordPress ready to init the REST API as needed.
	 *
	 * @since 1.0.0
	 */
	public function __construct() {

		// rest api endpoints.
		add_action( 'rest_api_init', array( $this, 'rest_api_init' ), 10 );
	}

	/**
	 * Register REST API after plugin activation
	 *
	 * @return void
	 * @since 1.0.0
	 */
	public function rest_api_init() {
		// Codes needs to be audited. Need to follow WP way here.

		foreach ( $this->get_rest_namespaces() as $namespace => $controllers ) {
			foreach ( $controllers as $controller_name => $route_class ) {
				$route_class_name                               = '\Mint\\MRM\\Admin\\API\\Routes\\' . $route_class;
				$this->routes[ $namespace ][ $controller_name ] = new $route_class_name();
				$this->routes[ $namespace ][ $controller_name ]->register_routes();
			}
		}
	}


	/**
	 * Get API namespaces - new namespaces should be registered here.
	 *
	 * @return array List of Namespaces and Main controller classes.
	 * @since 1.0.0
	 */
	protected function get_rest_namespaces() {
		return array(
			'mrm/v1' => $this->get_routes(),
		);
	}

	/**
	 * List of controllers in the mrm/v1 namespace.
	 *
	 * @return array
	 * @since 1.0.0
	 */
	protected function get_routes() {
		return apply_filters(
			'mrm_rest_api_routes',
			array(
				'lists'           => 'ListRoute',
				'segments'        => 'SegmentRoute',
				'tags'            => 'TagRoute',
				'notes'           => 'NoteRoute',
				'contacts'        => 'ContactRoute',
				'workflows'       => 'WorkflowRoute',
				'field-groups'    => 'FieldGroupRoute',
				'custom-fields'   => 'CustomFieldRoute',
				'general'         => 'GeneralRoute',
				'campaigns'       => 'CampaignRoute',
				'campaign-emails' => 'CampaignEmailRoute',
				'contact-columns' => 'ContactColumnRoute',
				'forms'           => 'FormRoute',
				'settings'        => 'SettingRoute',
			)
		);
	}

	/**
	 * Gets featured image
	 *
	 * @param object|array $object Image object.
	 * @param string       $field_name Field name in image object.
	 * @param array|object $request Request.
	 *
	 * @return false|mixed
	 */
	public function get_rest_featured_image( $object, $field_name, $request ) {
		if ( $object[ 'featured_media' ] ) {
			$img = wp_get_attachment_image_src( $object[ 'featured_media' ], 'app-thumb' );

			return $img[ 0 ];
		}

		return false;
	}
}
