<?php
/**
 * Class  GetContactsTest
 *
 * @package Mrm
 */

/**
 * Sample test case.
 */
class Test_Setting_Route extends WP_UnitTestCase {

	/**
	 * Holds the WP REST Server object
	 *
	 * @var WP_REST_Server
	 */
	private $server;

	/**
	 * @desc Setup initial dependencies
	 * @return void
	 * @since 1.0.0
	 */
	public function setUp():void {
		// Initiating the REST API.
		parent::setUp();

		global $wp_rest_server;
		$this->server = $wp_rest_server = new WP_REST_Server();
		do_action( 'rest_api_init' );
	}

	/**
	 * Delete the user and post after the test.
	 */
	public function tearDown():void {
		parent::tearDown();

		global $wp_rest_server;
		$wp_rest_server = null;
	}

	/**
	 * A single example test.
	 */
	public function test_update_wc_settings() {
		$request  = new WP_REST_Request( 'POST', '/mrm/v1/settings/wc' );
		$response = $this->server->dispatch( $request );
		$this->assertTrue( is_object( $response ) && 'WP_REST_Response' === get_class( $response ) );
		$this->assertTrue( 200 === $response->get_status() || 400 === $response->get_status() );
	}

	/**
	 * A single example test.
	 */
	public function test_get_wc_settings() {
		$request  = new WP_REST_Request( 'GET', '/mrm/v1/settings/wc' );
		$response = $this->server->dispatch( $request );
		$this->assertTrue( is_object( $response ) && 'WP_REST_Response' === get_class( $response ) );
		$this->assertTrue( 200 === $response->get_status() || 400 === $response->get_status() );
	}
}
