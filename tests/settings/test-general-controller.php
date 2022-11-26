<?php
/**
 * Class Test_WC_Controller
 *
 * @package mrm
 */

/**
 * Test cases for the functions of the production
 * class Rex_Product_Data_Retriever.
 *
 * @see /app/Admin/API/Controllers/GeneralSettingController.php
 */
class Test_General_Controller extends WP_UnitTestCase {
	private static $instance;

	/**
	 * @desc Setup initial dependencies
	 * @return void
	 * @since 1.0.0
	 */
	public function setUp(): void {
		self::$instance = \Mint\MRM\Admin\API\Controllers\GeneralSettingController::get_instance();
	}

	/**
	 * @desc Test case for create_or_update() function
	 * in GeneralSettingController class
	 * @test
	 * @return void
	 * @since 1.0.0
	 */
	public function create_or_update() {
		$request = new WP_REST_Request( 'POST', '/mrm/v1/general/' );
		$body    = array(
			'unsubscriber_settings'     => array(
				'confirmation_type'    => 'message',
				'page_id'              => 5,
				'url'                  => 'url',
				'confirmation_message' => 'String',
			),
			'preference'                => array(),
			'user_signup'               => array(),
			'comment_form_subscription' => array(),
		);
		$request->set_body( json_encode( $body ) );
		$response = self::$instance->create_or_update( $request );

		$this->assertTrue( is_object( $response ) );
		$this->assertTrue( 'WP_REST_Response' === get_class( $response ) || 'WP_Error' === get_class( $response ) );

		if ( 'WP_REST_Response' === get_class( $response ) ) {
			$this->assertTrue( 200 === $response->get_status() );
			$this->assertTrue( isset( $response->get_data()['success'] ) );
			$this->assertTrue( isset( $response->get_data()['message'] ) );
			$this->assertTrue( 'General settings have been successfully saved.' === $response->get_data()['message'] || 'No changes have been made.' === $response->get_data()['message'] );
		} elseif ( 'WP_Error' === get_class( $response ) ) {
			$this->assertTrue( 400 === $response->get_error_code() );
		}
	}

	/**
	 * @desc Test case for get() function
	 * in GeneralSettingController class
	 * @test
	 * @return void
	 * @since 1.0.0
	 */
	public function get() {
		$request  = new WP_REST_Request( 'GET', '/mrm/v1/general/' );
		$response = self::$instance->get( $request );
		$data     = $response->get_data();

		$this->assertTrue( is_object( $response ) );
		$this->assertTrue( 'WP_REST_Response' === get_class( $response ) );
		$this->assertTrue( 200 === $response->get_status() );
		$this->assertTrue( isset( $data['unsubscriber_settings'] ) );
		$this->assertTrue( isset( $data['preference'] ) );
		$this->assertTrue( isset( $data['user_signup'] ) );
		$this->assertTrue( isset( $data['comment_form_subscription'] ) );
		$this->assertTrue( isset( $data['success'] ) );

		$request = new WP_REST_Request( 'GET', '/mrm/v1/general/' );
		$request->set_param( 'general_settings_key', 'unsubscriber_settings' );
		$response = self::$instance->get( $request );
		$data     = $response->get_data();

		$this->assertTrue( is_object( $response ) );
		$this->assertTrue( 'WP_REST_Response' === get_class( $response ) );
		$this->assertTrue( 200 === $response->get_status() );
		$this->assertTrue( isset( $data['unsubscriber_settings'] ) );
		$this->assertTrue( ! isset( $data['preference'] ) );
		$this->assertTrue( ! isset( $data['user_signup'] ) );
		$this->assertTrue( ! isset( $data['comment_form_subscription'] ) );
		$this->assertTrue( isset( $data['success'] ) );

		$request = new WP_REST_Request( 'GET', '/mrm/v1/general/' );
		$request->set_param( 'general_settings_key', 'preference' );
		$response = self::$instance->get( $request );
		$data     = $response->get_data();

		$this->assertTrue( is_object( $response ) );
		$this->assertTrue( 'WP_REST_Response' === get_class( $response ) );
		$this->assertTrue( 200 === $response->get_status() );
		$this->assertTrue( ! isset( $data['unsubscriber_settings'] ) );
		$this->assertTrue( isset( $data['preference'] ) );
		$this->assertTrue( ! isset( $data['user_signup'] ) );
		$this->assertTrue( ! isset( $data['comment_form_subscription'] ) );
		$this->assertTrue( isset( $data['success'] ) );

		$request = new WP_REST_Request( 'GET', '/mrm/v1/general/' );
		$request->set_param( 'general_settings_key', 'user_signup' );
		$response = self::$instance->get( $request );
		$data     = $response->get_data();

		$this->assertTrue( is_object( $response ) );
		$this->assertTrue( 'WP_REST_Response' === get_class( $response ) );
		$this->assertTrue( 200 === $response->get_status() );
		$this->assertTrue( ! isset( $data['unsubscriber_settings'] ) );
		$this->assertTrue( ! isset( $data['preference'] ) );
		$this->assertTrue( isset( $data['user_signup'] ) );
		$this->assertTrue( ! isset( $data['comment_form_subscription'] ) );
		$this->assertTrue( isset( $data['success'] ) );

		$request = new WP_REST_Request( 'GET', '/mrm/v1/general/' );
		$request->set_param( 'general_settings_key', 'comment_form_subscription' );
		$response = self::$instance->get( $request );
		$data     = $response->get_data();

		$this->assertTrue( is_object( $response ) );
		$this->assertTrue( 'WP_REST_Response' === get_class( $response ) );
		$this->assertTrue( 200 === $response->get_status() );
		$this->assertTrue( ! isset( $data['unsubscriber_settings'] ) );
		$this->assertTrue( ! isset( $data['preference'] ) );
		$this->assertTrue( ! isset( $data['user_signup'] ) );
		$this->assertTrue( isset( $data['comment_form_subscription'] ) );
		$this->assertTrue( isset( $data['success'] ) );
	}
}
