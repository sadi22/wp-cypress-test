<?php
/**
 * Class  GetContactsTest
 *
 * @package Mrm
 */

/**
 * Sample test case.
 */
class GetContactsTest extends WP_UnitTestCase {

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
	 * A single example test.
	 */
	public function test_get_contacts() {
		$request  = new WP_REST_Request( 'GET', '/mrm/v1/contacts/' );
		$response = $this->server->dispatch( $request );
		$this->assertEquals( 404, $response->get_status() );
	}
}
