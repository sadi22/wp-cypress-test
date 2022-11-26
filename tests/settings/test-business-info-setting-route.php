<?php

class BusinessInfoSetting extends WP_UnitTestCase {
	/**
	 * Holds the WP REST Server object
	 *
	 * @var WP_REST_Server
	 */
	/**
	 * Holds the WP REST Server object
	 *
	 * @var WP_REST_Server
	 */
	private $server;

	/**
	 * Create a user and a post for our test.
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
	 * Business Info Create API route test.
	 */
	public function test_create_business_settings_api() {
		$request  = new WP_REST_Request( 'POST', '/mrm/v1/settings/business' );
		$response = $this->server->dispatch( $request );
		$this->assertTrue( 200 === $response->get_status() || 400 === $response->get_status() );
	}
	/**
	 * Business Info Create API route test.
	 */
	public function test_create_business_settings_wrong_api() {
		$request  = new WP_REST_Request( 'POST', '/mrm/v1/settings/business/nothing' );
		$response = $this->server->dispatch( $request );
		$this->assertEquals( 404, $response->get_status() );
	}

	/**
	 *  Business Info get API test.
	 */
	public function test_get_business_settings_api() {
		$request  = new WP_REST_Request( 'GET', '/mrm/v1/settings/business' );
		$response = $this->server->dispatch( $request );
		$this->assertTrue( 200 === $response->get_status() || 400 === $response->get_status() );
	}
	/**
	 *  Business Info get API test.
	 */
	public function test_get_business_settings_api_wrong() {
		$request  = new WP_REST_Request( 'GET', '/mrm/v1/settings/business/nothing' );
		$response = $this->server->dispatch( $request );
		$this->assertEquals( 404, $response->get_status() );
	}



}
