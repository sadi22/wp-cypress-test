<?php
/**
 * Class Test_Setting_Controller
 *
 * @package mrm
 */

/**
 * Test cases for the functions of the production
 * class Rex_Product_Data_Retriever.
 *
 * @see /app/Admin/API/Controllers/SettingController.php
 */

class Test_UserAssignContact extends WP_UnitTestCase {
	private static $instance;
	private static $reflector;

	/**
	 * @throws ReflectionException
	 */
	public function setUp(): void {
		self::$instance = \Mint\MRM\Internal\Admin\UserAssignContact::get_instance();
	}

	public function test_function_exist() {
		$function_exist = is_callable( array( self::$instance, 'assign_signup_user_in_contact' ) );
		$this->assertTrue( $function_exist );
	}

	public function test_assign_signup_user_in_contact() {
		$update = array(
			'business_name' => 'Coderex',
			'phone'         => 'Coderex',
			'address'       => 'Coderex',
			'logo_url'      => 'Coderex',
			'socialMedia'   => array(
				'icon' => 'http://localhost:10067/wp-content/uploads/2022/11/Group-48096544-8.png',
				'url'  => 'https://www.facebook.com/',
			),
		);

		update_option( '_mrm_general_user_signup', $update );
		$get_option = get_option( '_mrm_general_user_signup' );
		$user_id    = 4;
		$user_data  = array(
			'user_login' => 'shahin@coderex.coee',
			'user_email' => 'shahin@codeeerex.co',
			'user_pass'  => uniqid( 'id' ),
		);
		$response   = self::$instance->assign_signup_user_in_contact( $user_id, $user_data );

		$this->assertTrue( ! $response );

		$options_data = '';
		$expected     = is_array( $options_data );
		$actual       = '';
		$this->assertEquals( $actual, $expected );
	}

	public function test_comment_post_user_in_contact() {
		$update = array(
			'enable' => true,
			'lists'  => array(
				1,
				2,
				3,
				4,
			),
			'tags'   => array(
				1,
				2,
				3,
				4,
			),
		);

		update_option( '_mrm_general_comment_form_subscription', $update );
		$get_option       = get_option( '_mrm_general_user_signup' );
		$comment_ID       = 4;
		$comment_approved = true;
		$commentdata      = array(
			'comment_post_ID'      => 91,
			'comment_author'       => 'sdf',
			'comment_author_email' => 'sdfgsdfgsdfg@fgsd.co',
			'comment_author_url'   => '',
			'comment_content'      => 'sdf',
			'comment_type'         => 'comment',
			'comment_parent'       => 0,
			'user_id'              => 0,
			'user_ID'              => 0,
			'comment_author_IP'    => '127.0.0.1',
			'comment_agent'        => 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/107.0.0.0 Safari/537.36',
			'comment_date'         => '2022-11-16 10:03:31',
			'comment_date_gmt'     => '2022-11-16 10:03:31',
			'filtered'             => 1,
			'comment_approved'     => 0,
		);
		$response         = self::$instance->assign_comment_post_user_in_contact( $comment_ID, $comment_approved, $commentdata );

		$this->assertTrue( ! $response );

		$options_data = '';
		$expected     = is_array( $options_data );
		$actual       = '';
		$this->assertEquals( $actual, $expected );

		$options_data = $commentdata['comment_author_email'];
		$expected     = isset( $options_data );
		$actual       = true;
		$this->assertEquals( $actual, $expected );

		unset( $commentdata['comment_author_email'] );

		$options_data = isset( $commentdata['comment_author_email'] );
		$expected     = $options_data;
		$actual       = false;
		$this->assertEquals( $actual, $expected );
	}

}
