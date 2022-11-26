<?php
/**
 * Class  CustomFieldsControllerTest
 *
 * @package Mrm
 */

use Mint\MRM\Admin\API\Controllers\CustomFieldController;
use MRM\Common\MRM_Common;

/**
 * Message controller test case.
 */
class CustomFieldsControllerTest extends WP_UnitTestCase {

	 /**
	  * Holds the WP REST Server object
	  *
	  * @var WP_REST_Server
	  */
	private $server;

	/**
	 * mrm_messages table create for testing
	 */
	public function setUp():void {
		parent::setUp();

		// Database table create
		require_once ABSPATH . 'wp-admin/includes/upgrade.php';

		global $wpdb;

		$charsetCollate = $wpdb->get_charset_collate();

		$table = $wpdb->prefix . 'mrm_custom_fields';

		if ( $wpdb->get_var( "SHOW TABLES LIKE '$table'" ) != $table ) {
			$sql = "CREATE TABLE IF NOT EXISTS {$table} (
                `id` BIGINT UNSIGNED NOT NULL PRIMARY KEY AUTO_INCREMENT,
                `title` VARCHAR(255) NOT NULL,
                `slug` VARCHAR(255) NOT NULL,
                `type` VARCHAR(192) NOT NULL COMMENT 'text-input, text-number, text-area, dropdown, radio-button, checkbox date',
                `meta` TEXT NOT NULL,
                `created_at` TIMESTAMP,
                `updated_at` TIMESTAMP
             ) $charsetCollate;";

			dbDelta( $sql );
		}

		// Initiating the REST API.
		global $wp_rest_server;
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
	}


	/**
	 * API endpoint reuqest check
	 */
	public function test_post_reuqest() {
		$this->controller = CustomFieldController::get_instance();

		$request = new \WP_REST_Request( 'POST', '/mrm/v1/settings/custom-fields/' );

		$request->set_body_params(
			array(
				'title'   => 'Code Rex',
				'slug'    => 'coderex',
				'type'    => 'checkbox',
				'options' => array(
					'Backend',
					'Frontend',
					'Design',
				),
			)
		);

		// Get values from API
		$params = MRM_Common::get_api_params_values( $request );

		$response = $this->controller->create_or_update( $request );

		$this->assertEquals( 201, $response->data['code'] );

		// custom field title check
		$this->assertArrayHasKey( 'title', $params );

		// email body check
		$this->assertArrayHasKey( 'slug', $request );

		// email address check
		$this->assertArrayHasKey( 'type', $params );
	}

	/**
	 * API endpoint reuqest check with bad request
	 */
	public function test_post_bad_reuqest() {
		$this->controller = CustomFieldController::get_instance();

		$request = new \WP_REST_Request( 'POST', '/mrm/v1/settings/custom-fields/' );

		$request->set_body_params(
			array(
				'title'   => 'Code Rex',
				'slug'    => 'coderex',
				'options' => array(
					'Backend',
					'Frontend',
					'Design',
				),
			)
		);

		// Get values from API
		$params = MRM_Common::get_api_params_values( $request );

		$response = $this->controller->create_or_update( $request );

		$this->assertEquals( 'Type is mandatory', $response->errors['202']['0'] );
	}

	/**
	 * API endpoint reuqest check for get all fields
	 */
	public function test_get_all() {
		$this->controller = CustomFieldController::get_instance();

		$request = new \WP_REST_Request( 'GET', '/mrm/v1/settings/custom-fields/' );

		$response = $this->controller->get_all( $request );

		$this->assertEquals( 200, $response->data['code'] );
	}

	/**
	 * API endpoint reuqest check for get all fields
	 */
	public function test_delete_single() {
		$this->controller = CustomFieldController::get_instance();

		$field_id = rand( 1, 10 );

		$request = new \WP_REST_Request( 'GET', '/mrm/v1/settings/custom-fields/' );

		$request->set_url_params(
			array(
				'field_id' => $field_id,
			)
		);

		$response = $this->controller->delete_single( $request );

		$this->assertEquals( 200, $response->data['code'] );
	}

	/**
	 * API endpoint reuqest check for get single field
	 */
	public function test_get_single() {
		$this->controller = CustomFieldController::get_instance();

		$field_id = rand( 1, 10 );

		$request = new \WP_REST_Request( 'GET', '/mrm/v1/settings/custom-fields/' );

		$request->set_url_params(
			array(
				'field_id' => $field_id,
			)
		);

		$response = $this->controller->get_single( $request );

		$create_request = new \WP_REST_Request( 'POST', '/mrm/v1/settings/custom-fields/' );

		$create_request->set_body_params(
			array(
				'id'      => 1,
				'title'   => 'Code Rex',
				'slug'    => 'coderex',
				'type'    => 'checkbox',
				'options' => array(
					'Backend',
					'Frontend',
					'Design',
				),
			)
		);

		$create = $this->controller->create_or_update( $create_request );

		$this->assertEquals( 'Failed to get data', $response->errors['400']['0'] );
	}

}
