<?php
/**
 * REST API Campaign Email Controller
 *
 * Handles requests to the campaign email endpoint.
 *
 * @author   MRM Team
 * @category API
 * @package  MRM
 * @since    1.0.0
 */

namespace Mint\MRM\Admin\API\Controllers;

use Mint\MRM\DataBase\Models\CampaignEmailBuilderModel;
use Mint\MRM\DataBase\Models\CampaignModel;
use Mint\Mrm\Internal\Traits\Singleton;
use WP_REST_Request;
use MRM\Common\MRM_Common;
require_once ABSPATH . 'wp-admin/includes/image.php';
require_once ABSPATH . 'wp-admin/includes/file.php';
require_once ABSPATH . 'wp-admin/includes/media.php';

/**
 * This is the main class that controls the campaign email feature. Its responsibilities are:
 *
 * - Create new campaign email
 * - Delete single or multiple campaign email
 * - Retrieve single or multiple campaign email
 * - Send test email from campaign
 *
 * @package Mint\MRM\Admin\API\Controllers
 */
class CampaignEmailController extends BaseController {

	use Singleton;


	/**
	 * Campaign object arguments
	 *
	 * @var object
	 * @since 1.0.0
	 */
	public $args = array();


	/**
	 * Create or update email templates for each campaign
	 *
	 * @param WP_REST_Request $request Request object used to generate the response.
	 * @return \WP_REST_Response
	 * @since 1.0.0
	 */
	public function create_or_update( WP_REST_Request $request ) {
		$params = MRM_Common::get_api_params_values( $request );

		$response = array(
			'success' => true,
			'message' => '',
		);

		$email = CampaignModel::get_campaign_email_by_id( $params['campaign_id'], $params['email_index'] );

		if ( $email ) {
			$email_builder_data = CampaignEmailBuilderModel::is_new_email_template( $email->id );
			if ( ! $email_builder_data ) {
				CampaignEmailBuilderModel::insert(
					array(
						'email_id'   => $email->id,
						'status'     => 'published',
						'email_body' => $params['email_body'],
						'json_data'  => maybe_serialize( $params['json_data'] ),
					)
				);
				$response['message'] = __( 'Data successfully inserted', 'mrm' );
			} else {
				CampaignEmailBuilderModel::update(
					$email->id,
					array(
						'status'     => 'published',
						'email_body' => $params['email_body'],
						'json_data'  => maybe_serialize( $params['json_data'] ),
					)
				);
				$response['message'] = __( 'Data successfully updated', 'mrm' );
			}
		} else {
			$email_id = CampaignModel::insert_campaign_emails( $params['campaign_data']['emails'][ $params['email_index'] ], $params['campaign_id'], $params['email_index'] );
			CampaignEmailBuilderModel::insert(
				array(
					'email_id'   => $email_id,
					'status'     => 'published',
					'email_body' => $params['email_body'],
					'json_data'  => maybe_serialize( $params['json_data'] ),
				)
			);
		}
		$response['campaign_id'] = $params['campaign_id'];
		return rest_ensure_response( $response );
	}



	/**
	 * TODO: use this function to get single email
	 *
	 * @param WP_REST_Request $request Request object used to generate the response.
	 * @return void
	 */
	public function delete_single( WP_REST_Request $request ) {
		// TODO: Implement delete_single() method.
	}


	/**
	 * TODO: use this function to get single email
	 *
	 * @param WP_REST_Request $request Request object used to generate the response.
	 * @return void
	 */
	public function delete_all( WP_REST_Request $request ) {
		// TODO: Implement delete_all() method.
	}


	/**
	 * Create a new email for existing campaign
	 *
	 * @param WP_REST_Request $request Request object used to generate the response.
	 *
	 * @return WP_REST_Response
	 * @since 1.0.0
	 */
	public function create_new_campaign_email( WP_REST_Request $request ) {
		// Receive params from POST API request and prepare email data.
		$params      = MRM_Common::get_api_params_values( $request );
		$email_data  = isset( $params['email_data'] ) ? $params['email_data'] : array();
		$campaign_id = isset( $params['campaign_id'] ) ? $params['campaign_id'] : array();
		// Insert email data on campaign emails and email builder table.
		$email_id = CampaignModel::insert_campaign_emails( $email_data, $campaign_id, null );
		CampaignEmailBuilderModel::insert(
			array(
				'email_id'   => $email_id,
				'status'     => 'published',
				'email_body' => $params['email_body'],
				'json_data'  => maybe_serialize( $params['json_data'] ),
			)
		);

		$response['campaign_id'] = $campaign_id;
		return rest_ensure_response( $response );
	}


	/**
	 * Function use to get single campaign email
	 *
	 * @param WP_REST_Request $request Request object used to generate the response.
	 * @return WP_REST_Response
	 */
	public function get_single( WP_REST_Request $request ) {
		$params   = MRM_Common::get_api_params_values( $request );
		$email    = CampaignModel::get_email_by_index( $params['campaign_id'], $params['email_index'] );
		$response = array(
			'success' => true,
			'message' => '',
		);
		if ( ! $email ) {
			$response = array(
				'success' => false,
				'message' => 'No email data found!',
			);
			return rest_ensure_response( $response );
		}
		$email_builder_data     = CampaignEmailBuilderModel::get( $email->id );
		$response['email_data'] = $email_builder_data;
		return rest_ensure_response( $response );
	}


	/**
	 * TODO: use this function to get multiple email
	 *
	 * @param WP_REST_Request $request Request object used to generate the response.
	 * @return void
	 */
	public function get_all( WP_REST_Request $request ) {
		// TODO: Implement get_all() method.
	}


	/**
	 * We followed three steps to save a new email for a campaign.
	 *
	 * @param WP_REST_Request $request Request object used to generate the response.
	 * @return \WP_Error|\WP_REST_Response
	 *
	 * @since 1.0.0
	 */
	public function create_email( WP_REST_Request $request ) {
		$params      = MRM_Common::get_api_params_values( $request );
		$email_index = isset( $params['email_index'] ) ? $params['email_index'] : null;
		$response    = array(
			'success' => true,
			'message' => '',
		);

		if ( is_null( $email_index ) ) {
			return rest_ensure_response(
				array(
					'success' => false,
					'message' => 'There is something wrong. Email index of this campaign not found. Try again.',
				)
			);
		}

		// Step #1.
		if ( isset( $params['campaign_data']['status'] ) && null === $params['campaign_data']['status'] ) {
			$params['campaign_data']['status'] = 'draft';
		}

		$campaign    = CampaignModel::insert( $params['campaign_data'] );
		$campaign_id = $campaign['id'];

		// Insert campaign recipients information.
		$recipients = isset( $params['campaign_data']['recipients'] ) ? maybe_serialize( $params['campaign_data']['recipients'] ) : '';
		CampaignModel::insert_campaign_recipients( $recipients, $campaign_id );

		$params['campaign_data'][ $email_index ]['campaign_id'] = $campaign_id;
		$emails = isset( $params['campaign_data']['emails'] ) ? $params['campaign_data']['emails'] : '';
		// Step #2.
		foreach ( $emails as $index => $email ) {
			$email_id = CampaignModel::insert_campaign_emails( $email, $campaign_id, $index );
			if ( $index === $email_index ) {
				// Step #3.
				CampaignEmailBuilderModel::insert(
					array(
						'email_id'   => $email_id,
						'status'     => 'published',
						'email_body' => $params['email_body'],
						'json_data'  => maybe_serialize( $params['json_data'] ),
					)
				);
			}
		}
		$response['message']     = __( 'Data successfully inserted', 'mrm' );
		$response['campaign_id'] = $campaign_id;
		return rest_ensure_response( $response );
	}

	/**
	 * Get and send response to create or update a campaign
	 *
	 * @param WP_REST_Request $request Request object used to generate the response.
	 * @return \WP_REST_Response
	 * @since 1.0.0
	 */
	public function send_test_email( WP_REST_Request $request ) {

		// Get values from API.
		$params = MRM_Common::get_api_params_values( $request );

		$to      = isset( $params['json_data']['to'] ) ? $params['json_data']['to'] : '';
		$subject = isset( $params['json_data']['subject'] ) ? $params['json_data']['subject'] : '';
		$content = isset( $params['json_data']['content'] ) ? $params['json_data']['content'] : '';

		$headers = array( 'Content-Type: text/html; charset=UTF-8' );

		$response = array(
			'status'  => 'error',
			'message' => 'Failed to send',
		);

		if ( ! is_email( $to ) ) {
			$response = array(
				'status'  => 'error',
				'message' => 'Invalid Email',
			);
		}

		if ( ! empty( $to ) ) {
			wp_mail( $to, $subject, $content, $headers );
			$response = array(
				'status'  => 'success',
				'message' => 'Successfully sent',
			);
		}
		return $response;
	}

	/**
	 * Upload Media
	 *
	 * @param WP_REST_Request $request Request object used to generate the response.
	 * @return \WP_REST_Response
	 * @since 1.0.0
	 */
	public function upload_media( WP_REST_Request $request ) {
		$params   = $request->get_file_params();
		$movefile = wp_handle_upload( $params['image'], array( 'test_form' => false ) );
		return $movefile;
	}


	/**
	 * Get email template data from email builder
	 *
	 * @param WP_REST_Request $request Request object used to generate the response.
	 *
	 * @return WP_REST_Response
	 * @since 1.0.0
	 */
	public function get_email_builder_data( WP_REST_Request $request ) {
		// Receive params from POST API request and prepare email data.
		$params      = MRM_Common::get_api_params_values( $request );
		$email_id    = isset( $params['email_id'] ) ? $params['email_id'] : array();
		$campaign_id = isset( $params['campaign_id'] ) ? $params['campaign_id'] : array();

		$email    = CampaignModel::get_campaign_email_to_builder( $campaign_id, $email_id );
		$response = array(
			'success' => true,
			'message' => '',
		);
		if ( ! $email ) {
			$response = array(
				'success' => false,
				'message' => 'No email data found!',
			);
			return rest_ensure_response( $response );
		}
		$email_builder_data     = CampaignEmailBuilderModel::get( $email->id );
		$response['email_data'] = $email_builder_data;
		return rest_ensure_response( $response );
	}

}
