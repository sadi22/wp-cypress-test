<?php
/**
 * REST API WCSetting Controller
 *
 * Handles requests to the WooCommerce settings endpoint.
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
 * This is the main class that controls the WooCommerce setting feature. Its responsibilities are:
 *
 * - Create or update WooCommerce settings
 * - Retrieve WooCommerce settings from options table
 *
 * @package Mint\MRM\Admin\API\Controllers
 */
class WCSettingController extends SettingBaseController {

	use Singleton;

	/**
	 * Update WooCommerce global settings into wp_option table
	 *
	 * @param WP_REST_Request $request Request object used to generate the response.
	 * @return WP_REST_Response|WP_Error
	 * @since 1.0.0
	 */
	public function create_or_update( WP_REST_Request $request ) {
		$params = MRM_Common::get_api_params_values( $request );
		$params = is_array( $params ) && ! empty( $params ) ? $params : array(
			'enable'         => false,
			'checkbox_label' => 'Please put a checkbox label.',
			'lists'          => array(),
			'tags'           => array(),
		);

		if ( update_option( '_mrm_woocommerce_settings', $params ) ) {
			return $this->get_success_response( __( 'WooCommerce settings have been successfully saved.', 'mrm' ) );
		}
		return $this->get_error_response( __( 'No changes have been made.', 'mrm' ) );
	}

	/**
	 * Get WooCommerce global settings from wp_option table
	 *
	 * @param WP_REST_Request $request Request object used to generate the response.
	 * @return WP_REST_Response|WP_Error
	 * @since 1.0.0
	 */
	public function get( WP_REST_Request $request ) {
		$default  = array(
			'enable'         => false,
			'checkbox_label' => 'Please put a checkbox label.',
			'lists'          => array(),
			'tags'           => array(),
			'double_optin'   => true,
		);
		$settings = get_option( '_mrm_woocommerce_settings', $default );
		$settings = is_array( $settings ) && ! empty( $settings ) ? $settings : $default;
		return $this->get_success_response_data( $settings );
	}
}
