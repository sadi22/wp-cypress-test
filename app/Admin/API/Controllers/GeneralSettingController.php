<?php
/**
 * REST API General Setting Controller
 *
 * Handles requests to the general setting endpoint.
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

/**
 * This is the main class that controls the general setting feature. Its responsibilities are:
 *
 * - Create or update general settings
 * - Retrieve general settings from options table
 *
 * @package Mint\MRM\Admin\API\Controllers
 */
class GeneralSettingController extends SettingBaseController {

	use Singleton;

	/**
	 * Update General global settings into wp_options table
	 *
	 * @param WP_REST_Request $request Request object used to generate the response.
	 * @return array|WP_REST_Response
	 * @since 1.0.0
	 */
	public function create_or_update( WP_REST_Request $request ) {
		$params = MRM_Common::get_api_params_values( $request );

		if ( is_array( $params ) && ! empty( $params ) ) {
			foreach ( $params as $key => $value ) {
				if ( isset( $value['confirmation_type'] ) && 'message' === $value['confirmation_type'] ) {
					$value['confirmation_message'] = isset( $value['confirmation_message'] ) ? html_entity_decode( $value['confirmation_message'] ) : '';
				}
				if ( isset( $value['confirmation_type'] ) && 'redirect' === $value['confirmation_type'] ) {
					if ( isset( $value['url'] ) && ! empty( $value['url'] ) ) {
						if ( filter_var( $value['url'], FILTER_VALIDATE_URL ) === false ) {
							return $this->get_error_response( __( ' URL is not valid', 'mrm' ) );
						}
					}
				}
				update_option( '_mrm_general_' . $key, $value );
			}
			return $this->get_success_response( __( 'General settings have been successfully saved.', 'mrm' ) );
		}
		return $this->get_error_response( __( 'No changes have been made.', 'mrm' ) );
	}

	/**
	 * Get General global settings from wp_option table
	 *
	 * @param WP_REST_Request $request Request object used to generate the response.
	 * @return array|WP_REST_Response
	 * @since 1.0.0
	 */
	public function get( WP_REST_Request $request ) {
		$params = MRM_Common::get_api_params_values( $request );

		$option_keys = apply_filters(
			'mrm_general_settings_option_key',
			array(
				'unsubscriber_settings',
				'preference',
				'user_signup',
				'comment_form_subscription',
			)
		);

		$settings = array();

		if ( isset( $params['general_settings_key'] ) ) {
			$key              = $params['general_settings_key'];
			$settings[ $key ] = get_option( '_mrm_general_' . $key, array() );
		} else {
			foreach ( $option_keys as $key ) {
				$settings[ $key ] = get_option( '_mrm_general_' . $key, array() );
			}
		}

		$settings = is_array( $settings ) && ! empty( $settings ) ? $settings : array();
		return $this->get_success_response_data( $settings );
	}
}
