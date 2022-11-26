<?php

use MRM\Common\MRM_Common;

class DoubleOptinSettingTest extends WP_UnitTestCase {
	/**
	 * Holds the WP REST Server object
	 *
	 * @var WP_REST_Server
	 */
	private $server;

	private $administrator;

	/**
	 * Double opt-in setting controller instance
	 */
	private static $instance;

	protected $namespaced_route = 'settings/optin';

	/**
	 * mrm_campaigns table create for testing
	 */
	public function setUp():void {
		parent::setUp();

		self::$instance = \Mint\MRM\Admin\API\Controllers\OptinSettingController::get_instance();

		// create wp_options table on database container
		require_once ABSPATH . 'wp-admin/includes/upgrade.php';

		global $wpdb;
		$charsetCollate = $wpdb->get_charset_collate();
		$table          = $wpdb->prefix . 'options';

		if ( $wpdb->get_var( "SHOW TABLES LIKE '$table'" ) != $table ) {
			$sql = "CREATE TABLE IF NOT EXISTS {$table} (
                `option_id` BIGINT UNSIGNED NOT NULL PRIMARY KEY AUTO_INCREMENT,
                `option_name` VARCHAR(192) NULL,
                `option_value` LONGTEXT,
                `autoload` VARCHAR(20) DEFAULT 'yes'
             ) $charsetCollate;";

			dbDelta( $sql );
		}

		// Initiating the REST API.
		/** @var WP_REST_Server $wp_rest_server */
		global $wp_rest_server;
		$this->administrator = $this->factory->user->create(
			array(
				'role' => 'administrator',
			)
		);
		wp_set_current_user( $this->administrator );
		$this->server = $wp_rest_server = new \WP_REST_Server();
		do_action( 'rest_api_init' );
	}


	/**
	 * Delete the server after the test.
	 */
	public function tearDown():void {
		parent::tearDown();

		global $wp_rest_server;
		$wp_rest_server = null;
		$this->server   = null;

		wp_set_current_user( array() );
	}

	/**
	 * Optin create or update POST request response test
	 */
	public function test_create_update_route() {
		$request  = new WP_REST_Request( 'POST', '/mrm/v1/settings/optin' );
		$response = $this->server->dispatch( $request );
		$request->set_body_params(
			array()
		);
		$this->assertEquals( 200, $response->get_status() );

		wp_set_current_user( array() );
	}

	/**
	 * Optin setting post request api params key check
	 */
	public function test_create_or_update() {
		$request  = new WP_REST_Request( 'POST', '/mrm/v1/settings/optin' );
		$response = $this->server->dispatch( $request );
		$request->set_body_params(
			array(
				'optin' => array(
					'enable'               => true,
					'email_subject'        => 'Double opt-in confirmation email',
					'email_body'           => "<p>Hi Tuhin,</p>\n<p>This is just an hello</p>",
					'confirmation_type'    => 'message',
					'confirmation_message' => 'Your subscription to our list has been confirmed.',
				),
			)
		);

		// Get values from API
		$params = MRM_Common::get_api_params_values( $request );

		// optin key check on api param values
		$this->assertArrayHasKey( 'optin', $params );
		$setting_value = isset( $params['optin'] ) ? $params['optin'] : array();

		$response = self::$instance->create_or_update( $request );
		$this->assertTrue( is_object( $response ) && get_class( $response ) === 'WP_REST_Response' || get_class( $response ) === 'WP_Error' );

		if ( 'WP_REST_Response' === get_class( $response ) ) {
			$this->assertTrue( 200 === $response->get_status() );
		} elseif ( 'WP_Error' === get_class( $response ) ) {
			$this->assertTrue( 400 === $response->get_error_code() );
		}
	}


	/**
	 * Optin GET request response test
	 */
	public function test_get_route() {
		$request  = new WP_REST_Request( 'GET', '/mrm/v1/settings/optin' );
		$response = $this->server->dispatch( $request );
		$this->assertEquals( 200, $response->get_status() );
	}


	/**
	 * Test double opt-in setting get from database
	 */
	public function test_get() {
		$body    = array(
			'optin' => array(
				'enable'               => true,
				'email_subject'        => 'Double opt-in confirmation email',
				'email_body'           => "<p>Hi Tuhin,</p>\n<p>This is just an hello</p>",
				'confirmation_type'    => 'message',
				'confirmation_message' => 'Your subscription to our list has been confirmed.',
			),
		);
		$request = new WP_REST_Request( 'GET', '/mrm/v1/settings/optin' );
		update_option( '_mrm_optin_settings', $body );
		$response = self::$instance->get( $request );
		$this->assertTrue( is_object( $response ) );
		$this->assertTrue( 'WP_REST_Response' === get_class( $response ) );
		$this->assertTrue( 200 === $response->get_status() );
		$this->assertTrue( isset( $response->get_data()['success'] ) && $response->get_data()['success'] );
	}



}
