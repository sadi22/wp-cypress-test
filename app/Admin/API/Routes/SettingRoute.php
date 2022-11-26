<?php
/**
 * Mail Mint
 *
 * @author [MRM Team]
 * @email [support@rextheme.com]
 * @create date 2022-08-09 11:03:17
 * @modify date 2022-08-09 11:03:17
 * @package /app/API/Routes
 */

namespace Mint\MRM\Admin\API\Routes;

use Mint\MRM\Admin\API\Controllers\GeneralSettingController;
use Mint\MRM\Admin\API\Controllers\WCSettingController;
use Mint\MRM\Admin\API\Controllers\BusinessSettingController;
use Mint\MRM\Admin\API\Controllers\EmailSettingController;
use Mint\MRM\Admin\API\Controllers\OptinSettingController;

/**
 * [Manage double opt-in settings API routes]
 *
 * @desc Manage double opt-in settings API routes
 * @package /app/API/Routes
 * @since 1.0.0
 */
class SettingRoute {

	/**
	 * Endpoint namespace.
	 *
	 * @var string
	 * @since 1.0.0
	 */
	protected $namespace = 'mrm/v1';

	/**
	 * Route base.
	 *
	 * @var string
	 * @since 1.0.0
	 */
	protected $rest_base = 'settings';

	/**
	 * WCSettingController class instance variable
	 *
	 * @var object
	 * @since 1.0.0
	 */
	protected $wc_controller;

	/**
	 * OptinSettingController class object
	 *
	 * @var object
	 * @since 1.0.0
	 */
	protected $optin_controller;

	/**
	 * BusinessSettingController class object
	 *
	 * @var object
	 * @since 1.0.0
	 */
	protected $business_controller;

	/**
	 * EmailSettingController class object
	 *
	 * @var object
	 * @since 1.0.0
	 */
	protected $email_controller;

	/**
	 * GeneralSettingController class instance variable
	 *
	 * @var object
	 * @since 1.0.0
	 */
	protected $general_controller;

	/**
	 * Register API endpoints routes for tags module
	 *
	 * @return void
	 * @since 1.0.0
	 */
	public function register_routes() {
		// WCSettingController class instance.
		$this->wc_controller = WCSettingController::get_instance();

		// API routes for WooCommerce settings.
		register_rest_route(
			$this->namespace,
			'/' . $this->rest_base . '/wc/',
			array(
				array(
					'methods'             => \WP_REST_Server::CREATABLE,
					'callback'            => array(
						$this->wc_controller,
						'create_or_update',
					),
					'permission_callback' => array(
						$this->wc_controller,
						'rest_permissions_check',
					),
				),
				array(
					'methods'             => \WP_REST_Server::READABLE,
					'callback'            => array(
						$this->wc_controller,
						'get',
					),
					'permission_callback' => array(
						$this->wc_controller,
						'rest_permissions_check',
					),
				),
			)
		);

		$this->email_controller = EmailSettingController::get_instance();
		/**
		 * Settings email endpoints
		 *
		 * @return void
		 * @since 1.0.0
		*/
		register_rest_route(
			$this->namespace,
			'/' . $this->rest_base . '/email',
			array(
				array(
					'methods'             => \WP_REST_Server::CREATABLE,
					'callback'            => array(
						$this->email_controller,
						'create_or_update',
					),
					'permission_callback' => array(
						$this->email_controller,
						'rest_permissions_check',
					),
				),
				array(
					'methods'             => \WP_REST_Server::READABLE,
					'callback'            => array(
						$this->email_controller,
						'get',
					),
					'permission_callback' => array(
						$this->email_controller,
						'rest_permissions_check',
					),
				),
			)
		);

		/**
		 * Register rest routes for double opt-in settings
		 *
		 * @since 1.0.0
		*/
		$this->optin_controller = OptinSettingController::get_instance();

		register_rest_route(
			$this->namespace,
			'/' . $this->rest_base . '/optin',
			array(

				// POST request for store on wp_options table.
				array(
					'methods'             => \WP_REST_Server::CREATABLE,
					'callback'            => array(
						$this->optin_controller,
						'create_or_update',
					),
					'permission_callback' => array(
						$this->optin_controller,
						'rest_permissions_check',
					),
				),

				// GET request for retrieving double opt-in settings.
				array(
					'methods'             => \WP_REST_Server::READABLE,
					'callback'            => array(
						$this->optin_controller,
						'get',
					),
					'permission_callback' => array(
						$this->optin_controller,
						'rest_permissions_check',
					),
				),
			)
		);

		/**
		 * Business info controller
		 */
		$this->business_controller = BusinessSettingController::get_instance();
		/**
		 * Register rest routes for double opt-in settings
		 *
		 * @since 1.0.0
		*/
		register_rest_route(
			$this->namespace,
			'/' . $this->rest_base . '/business',
			array(

				// POST request for store on wp_options table.
				array(
					'methods'             => \WP_REST_Server::CREATABLE,
					'callback'            => array(
						$this->business_controller,
						'create_or_update',
					),
					'permission_callback' => array(
						$this->business_controller,
						'rest_permissions_check',
					),
				),

				// GET request for retrieving Business settings.
				array(
					'methods'             => \WP_REST_Server::READABLE,
					'callback'            => array(
						$this->business_controller,
						'get',
					),
					'permission_callback' => array(
						$this->business_controller,
						'rest_permissions_check',
					),
				),
			)
		);

		// GeneralSettingController class instance.
		$this->general_controller = GeneralSettingController::get_instance();

		// API routes for WooCommerce settings.
		register_rest_route(
			$this->namespace,
			'/' . $this->rest_base . '/general(?:/(?P<general_settings_key>[a-z-|_]+))?',
			array(
				array(
					'methods'             => \WP_REST_Server::CREATABLE,
					'callback'            => array(
						$this->general_controller,
						'create_or_update',
					),
					'permission_callback' => array(
						$this->general_controller,
						'rest_permissions_check',
					),
				),
				array(
					'methods'             => \WP_REST_Server::READABLE,
					'callback'            => array(
						$this->general_controller,
						'get',
					),
					'permission_callback' => array(
						$this->general_controller,
						'rest_permissions_check',
					),
				),
			)
		);
	}
}
