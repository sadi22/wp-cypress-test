<?php

use Mint\MRM\Admin\API\Controllers\EmailSettingController;
use MRM\Common\MRM_Common;

class EmailSettings extends WP_UnitTestCase {
	/**
	 * Holds the WP REST Server object
	 *
	 * @var WP_REST_Server
	 */
	private $server;

	/**
	 * MRM_Tag_Controller class object
	 *
	 * @var object
	 * @since 1.0.0
	 */
	protected $controller;

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
	 * Test case to check bad request for email creatiion
	 */
	public function test_create_email_settings_bad_request_both_worng_email() {
		$this->controller = EmailSettingController::get_instance();

		// Checking a bad request where both emails are not valid
		$bad_request_both_wrong_email = new \WP_REST_Request( 'POST', '/mrm/v1/settings/email' );

		$bad_request_both_wrong_email->set_body_params(
			array(
				'from_name'   => 'sfasdf',
				'from_email'  => 'fdaslf',
				'reply_name'  => 'fdsafsa',
				'reply_email' => 'fdsaf',
			)
		);

		$response = $this->controller->create_or_update( $bad_request_both_wrong_email );

		$this->assertEquals( 0, $response['success'] );
		$this->assertEquals( 'Enter a valid email address from where to send email', $response['message'] );
	}

	/*
	** Checking a bad request where only reply email is Invalid
	*/
	public function test_create_email_bad_request_only_reply_email() {
		$this->controller = EmailSettingController::get_instance();

		$bad_request_reply_email = new \WP_REST_Request( 'POST', '/mrm/v1/settings/email' );

		$bad_request_reply_email->set_body_params(
			array(
				'from_name'   => 'Coderex',
				'from_email'  => 'support@coderex.co',
				'reply_name'  => 'fdsafsa',
				'reply_email' => 'fdsaf',
			)
		);

		$response = $this->controller->create_or_update( $bad_request_reply_email );

		$this->assertEquals( 0, $response['success'] );
		$this->assertEquals( 'Enter a valid email address where to reply email', $response['message'] );
	}

	/*
	** Checking a bad request where only from email is Invalid
	*/
	public function test_create_email_bad_request_only_from_email() {
		$this->controller = EmailSettingController::get_instance();

		$bad_request_from_email = new \WP_REST_Request( 'POST', '/mrm/v1/settings/email' );

		$bad_request_from_email->set_body_params(
			array(
				'from_name'   => 'Coderex',
				'from_email'  => 'Invalid',
				'reply_name'  => 'fdsafsa',
				'reply_email' => 'google@gmail.com',
			)
		);

		$response = $this->controller->create_or_update( $bad_request_from_email );

		$this->assertEquals( 0, $response['success'] );
		$this->assertEquals( 'Enter a valid email address from where to send email', $response['message'] );
	}

	/*
	** Checking a bad request where Email Field is empty
	*/
	public function test_create_email_bad_request_empty_email() {
		$this->controller = EmailSettingController::get_instance();

		$bad_request_empty_email = new \WP_REST_Request( 'POST', '/mrm/v1/settings/email' );

		$bad_request_empty_email->set_body_params(
			array(
				'from_name'  => 'Coderex',
				'reply_name' => 'fdsafsa',
			)
		);

		$response = $this->controller->create_or_update( $bad_request_empty_email );

		$this->assertEquals( 0, $response['success'] );
		$this->assertEquals( 'Email address is mandatory', $response['message'] );
	}

	/*
	** Test to send no parameter
	*/
	public function test_create_email_bad_request_no_parameter() {
		$this->controller = EmailSettingController::get_instance();

		$bad_request_empty_email = new \WP_REST_Request( 'POST', '/mrm/v1/settings/email' );

		$bad_request_empty_email->set_body_params(
			array()
		);

		$response = $this->controller->create_or_update( $bad_request_empty_email );

		$this->assertEquals( 0, $response['success'] );
		$this->assertEquals( 'Email address is mandatory', $response['message'] );
	}

	/**
	 * Test case to check good request for email-settings creation
	 */
	public function test_create_email_settings_good_request() {
		$this->controller = EmailSettingController::get_instance();

		$good_request = new \WP_REST_Request( 'POST', '/mrm/v1/settings/email' );

		$good_request->set_body_params(
			array(
				'from_name'   => 'Coderex',
				'from_email'  => 'support@coderex.co',
				'reply_name'  => 'Google',
				'reply_email' => 'support@google.com',
			)
		);

		$response = $this->controller->create_or_update( $good_request );

		$this->assertEquals( 1, $response['success'] );
		$this->assertEquals( 'Email settings has been saved successfully', $response['message'] );
		$this->assertEquals( 201, $response['code'] );
	}

	/**
	 * Test case to get email-settings
	 */
	public function test_get_email_settings() {
		$this->controller = EmailSettingController::get_instance();

		$request = new \WP_REST_Request( 'GET', '/mrm/v1/settings/email' );

		$response = $this->controller->get( $request );

		$this->assertEquals( 400, $response['code'] );
		$this->assertEquals( 'Option key does not exist', $response['message'] );

		$post_request = new \WP_REST_Request( 'POST', '/mrm/v1/settings/email' );

		$post_request->set_body_params(
			array(
				'from_name'   => 'Coderex',
				'from_email'  => 'support@coderex.co',
				'reply_name'  => 'Google',
				'reply_email' => 'support@google.com',
			)
		);

		$response = $this->controller->create_or_update( $post_request );

		$check = $this->controller->get( $post_request );

		$this->assertEquals( 200, $check['code'] );
		$this->assertEquals( 'Query Successfull', $check['message'] );
	}
}
