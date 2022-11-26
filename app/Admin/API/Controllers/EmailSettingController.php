<?php
/**
 * REST API Email Setting Controller
 *
 * Handles requests to the Email setting endpoint.
 *
 * @author   MRM Team
 * @category API
 * @package  MRM
 * @since    1.0.0
 */

namespace Mint\MRM\Admin\API\Controllers;

use Mint\Mrm\Internal\Traits\Singleton;
use MRM\Common\MRM_Common;
use WP_REST_Request;
use Exception;

/**
 * This is the main class that controls the email setting feature. Its responsibilities are:
 *
 * - Create or update email settings
 * - Retrieve email settings from options table
 *
 * @package Mint\MRM\Admin\API\Controllers
 */
class EmailSettingController extends SettingBaseController {

	use Singleton;

	/**
	 * Settings object arguments
	 *
	 * @var object
	 * @since 1.0.0
	 */
	public $args;

	/**
	 * Get and send response to create or update a new settings
	 *
	 * @param WP_REST_Request $request Request object used to generate the response.
	 * @return WP_REST_Response
	 * @since 1.0.0
	 */
	public function create_or_update( WP_REST_Request $request ) {
		// Get values from API.
		$params = MRM_Common::get_api_params_values( $request );

		// From email address validation.
		if ( isset( $params['from_email'] ) ) {
			$from_email = sanitize_text_field( $params['from_email'] );

			if ( ! is_email( $from_email ) && ! empty( $from_email ) ) {
				$from_email_validation_failded = array(
					'success' => false,
					'message' => 'Enter a valid email address from where to send email',
					'code'    => 200,
				);
				return $from_email_validation_failded;
			}
		}

		// Reply to email address validation.
		if ( isset( $params['reply_email'] ) ) {
			$reply_email = sanitize_text_field( $params['reply_email'] );

			if ( ! is_email( $reply_email ) && ! empty( $reply_email ) ) {
				$reply_email_validation_failded = array(
					'success' => false,
					'message' => 'Enter a valid email address where to reply email',
					'code'    => 200,
				);
				return $reply_email_validation_failded;
			}
		}

		// create email settings.
		$from_name   = isset( $params['from_name'] ) ? $params['from_name'] : '';
		$reply_name  = isset( $params['reply_name'] ) ? $params['reply_name'] : '';
		$from_email  = isset( $params['from_email'] ) ? $params['from_email'] : '';
		$reply_email = isset( $params['reply_email'] ) ? $params['reply_email'] : '';

		if ( empty( $reply_email ) || empty( $from_email ) ) {
			$email_existance_failed = array(
				'success' => false,
				'message' => 'Email address is mandatory',
				'code'    => 200,
			);
			return $email_existance_failed;
		}

		$from_name  = sanitize_text_field( $from_name );
		$reply_name = sanitize_text_field( $reply_name );

		$email_settings = array(
			'from_name'   => $from_name,
			'from_email'  => $from_email,
			'reply_name'  => $reply_name,
			'reply_email' => $reply_email,
		);

		// enque to wp option table.
		if ( update_option( '_mrm_email_settings', $email_settings, 'yes' ) ) {
			$success_data = array(
				'success' => true,
				'message' => 'Email settings has been saved successfully',
				'code'    => 201,
				'data'    => $email_settings,
			);
			return $success_data;
		}
		$failed_data = array(
			'success' => false,
			'message' => 'No changes made. Can not save.',
			'code'    => 400,
		);
		return $failed_data;
	}


	/**
	 * Function used to handle a single get request
	 *
	 * @param WP_REST_Request $request Request object used to generate the response.
	 * @return WP_REST_Response
	 * @since 1.0.0
	 */
	public function get( WP_REST_Request $request ) {
		if ( ! get_option( '_mrm_email_settings' ) ) {
			$email_settings_data_failed = array(
				'code'    => 400,
				'message' => 'Option key does not exist',
				'data'    => null,
			);
			return $email_settings_data_failed;
		}
		$email_settings_data = array(
			'code'    => 200,
			'message' => 'Query Successfull',
			'data'    => get_option( '_mrm_email_settings' ),
		);

		return $email_settings_data;
	}
}
