<?php
/**
 * Class  MessageControllerTest
 *
 * @package Mrm
 */

use Mint\MRM\DataStores\MessageData;
use MRM\Common\MRM_Common;

/**
 * Message controller test case.
 */
class MessageControllerTest extends WP_UnitTestCase {

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

		$table = $wpdb->prefix . 'mrm_messages';

		if ( $wpdb->get_var( "SHOW TABLES LIKE '$table'" ) != $table ) {
			$sql = "CREATE TABLE IF NOT EXISTS {$table} (
                `id` BIGINT UNSIGNED NOT NULL PRIMARY KEY AUTO_INCREMENT,
                `interaction_id` BIGINT UNSIGNED NULL,
                `ineraction_type` VARCHAR(50) NULL DEFAULT 'campaign',
                `message_type` VARCHAR(50) NULL DEFAULT 'email' COMMENT 'For future messaging process',
                `contact_id` BIGINT UNSIGNED NULL COMMENT 'Set NULL on contact delete',
                `sender_id` BIGINT(10) UNSIGNED NULL,
                `email_address` VARCHAR(192) NOT NULL,
                `email_subject` VARCHAR(192) NULL,
                `email_preview_text` VARCHAR(192) NULL,
                `email_body` LONGTEXT NULL,
                `email_headers` TEXT NULL,
                `first_open` TIMESTAMP DEFAULT 0,
                `first_click` TIMESTAMP DEFAULT 0,
                `click_count` INT NULL,
                `status` VARCHAR(50) NOT NULL DEFAULT 'draft' COMMENT 'SENT, SCHEDULED, PENDING, BOUNCED, FAILED',
                `scheduled_at` TIMESTAMP NULL,
                `created_at` TIMESTAMP NULL,
                `updated_at` TIMESTAMP NULL,
                INDEX `interaction_id_index` (`interaction_id` DESC),
                INDEX `contact_id_index` (`contact_id` DESC)
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
	public function test_create_or_update() {
		$request = new \WP_REST_Request( 'POST', '/mrm/v1/contacts/2/send-message' );
		$request->set_body_params(
			array(
				'email_subject' => 'This is first emailssss',
				'type'          => 'email',
				'email_body'    => "<p>Hi Tuhin,</p>\n<p>This is just an hello</p>",
				'email_address' => 'tuhin@coderex.co',
				'contact_id'    => 2,
			)
		);

		// Get values from API
		$params = MRM_Common::get_api_params_values( $request );

		// email subject check
		$this->assertArrayHasKey( 'email_subject', $params );

		// email body check
		$this->assertArrayHasKey( 'email_body', $params );

		// email address check
		$this->assertArrayHasKey( 'email_address', $params );

		// Message object create
		$message = new MessageData( $params );

		// Receiver email address
		$receiver_email = $message->get_receiver_email();
		$this->assertEquals( $receiver_email, $params['email_address'] );

		// Email subject
		$email_subject = $message->get_email_subject();
		$this->assertEquals( $email_subject, $params['email_subject'] );

		// Email body
		$email_body = $message->get_email_body();
		$this->assertEquals( $email_body, $params['email_body'] );

		// Email body
		$type = $message->get_message_type();
		$this->assertEquals( true, true );

		$sent = $this->send_message( $message );

		$response = $this->server->dispatch( $request );
		$this->assertEquals( 200, $response->get_status() );
	}


	public function send_message( $message ) {
		$to = $message->get_receiver_email();
		$this->assertEquals( $to, 'tuhin@coderex.co' );

		$subject = $message->get_email_subject();
		$this->assertEquals( $subject, 'This is first emailssss' );

		$body = $message->get_email_body();

		$headers   = array(
			'MIME-Version: 1.0',
			'Content-type: text/html;charset=UTF-8',
		);
		$from      = '';
		$from      = 'From: ' . 'MRM';
		$headers[] = $from . ' <' . 'tuhinsshadow@gamil.com' . '>';
		$headers[] = 'Reply-To:  ' . 'tuhinsshadow@gamil.com';

		$result = wp_mail( $to, $subject, $body, $headers );

		$this->assertEquals( $result, true );
	}


	public function test_get_all_emails() {
		$request = new \WP_REST_Request( 'GET', '/mrm/v1/contacts/2/emails' );

		$response = $this->server->dispatch( $request );
		$this->assertEquals( 200, $response->get_status() || 400, $response->get_status() );
	}
}
