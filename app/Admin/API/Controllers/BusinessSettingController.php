<?php
/**
 * REST API Business Setting Controller
 *
 * Handles requests to the business setting endpoint.
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
 * This is the main class that controls the business setting feature. Its responsibilities are:
 *
 * - Create or update business settings
 * - Retrieve business settings from options table
 *
 * @package Mint\MRM\Admin\API\Controllers
 */
class BusinessSettingController extends SettingBaseController {


	use Singleton;

	/**
	 * Setiings object arguments
	 *
	 * @var object
	 * @since 1.0.0
	 */
	public $args;

	/**
	 * Business settings key for options table
	 *
	 * @var string
	 * @since 1.0.0
	 */
	protected $option_key = '_mrm_business_info_setting';

	/**
	 * Get and send response to create a new settings
	 *
	 * @param WP_REST_Request $request Request object used to generate the response.
	 *
	 * @return WP_REST_Response|\WP_Error
	 */
	public function create_or_update( WP_REST_Request $request ) {
		$params = MRM_Common::get_api_params_values( $request );
		if ( is_array( $params ) ) {
			if ( ! empty( $params ) ) {
				$business_name = isset( $params['business_name'] ) ? sanitize_text_field( $params['business_name'] ) : '';
				$phone         = isset( $params['phone'] ) ? sanitize_text_field( $params['phone'] ) : '';
				$address       = isset( $params['address'] ) ? sanitize_text_field( $params['address'] ) : '';
				$logo_url      = isset( $params['logo_url'] ) ? sanitize_text_field( $params['logo_url'] ) : '';
				$social        = isset( $params['socialMedia'] ) ? $params['socialMedia'] : array();

				if ( ctype_punct( $business_name ) ) {
					return $this->get_error_response( __( 'Business name not only special characters ', 'mrm' ) );
				}
				if ( ctype_punct( $address ) ) {
					return $this->get_error_response( __( 'Address name not only special characters ', 'mrm' ) );
				}

				if ( ! $this->phone_number_validation( $phone ) ) {
					return $this->get_error_response( __( 'Phone number format is not correct', 'mrm' ) );
				}
				$image_mime = array(
					'jpg|jpeg|jpe' => 'image/jpeg',
					'gif'          => 'image/gif',
					'png'          => 'image/png',
					'bmp'          => 'image/bmp',
					'tiff|tif'     => 'image/tiff',
					'webp'         => 'image/webp',
					'ico'          => 'image/x-icon',
					'heic'         => 'image/heic',
				);
				$logo_mimes = wp_check_filetype( $logo_url );
				if ( isset( $logo_mimes['type'] ) ) {
					if ( ! in_array( $logo_mimes['type'], $image_mime, true ) ) {
						/* translators: %s logo mimes */
						return $this->get_error_response( sprintf( __( 'Image type %s is not supported', 'mrm' ), $logo_mimes['ext'] ) );
					}
				}
				foreach ( $social as $social_file ) {
					if ( isset( $social_file['icon'] ) && ! empty( $social_file['icon'] ) ) {
						$_mimes = wp_check_filetype( $social_file['icon'] );
						if ( isset( $_mimes['type'] ) ) {
							if ( ! in_array( $_mimes['type'], $image_mime, true ) ) {
								/* translators: %s mimes type */
								return $this->get_error_response( sprintf( __( 'Social media image type %s is not supported', 'mrm' ), $_mimes['ext'] ) );
							}
						}
					}
					if ( isset( $social_file['url'] ) && ! empty( $social_file['url'] ) ) {
						if ( filter_var( $social_file['url'], FILTER_VALIDATE_URL ) === false ) {
							return $this->get_error_response( sprintf( __( 'URL is not valid', 'mrm' ) ) );
						}
					}
				}
				$business_options = array(
					'business_name' => $business_name,
					'phone'         => $phone,
					'address'       => $address,
					'logo_url'      => $logo_url,
					'socialMedia'   => $social,
				);
				update_option( $this->option_key, $business_options );
				return $this->get_success_response( __( 'Business information settings has been successfully saved.', 'mrm' ) );
			}
		}

		return $this->get_error_response( __( 'Failed to get data', 'mrm' ), 400 );
	}


	/**
	 * Function used to handle a single get request
	 *
	 * @param WP_REST_Request $request Request object used to generate the response.
	 * @return WP_REST_Response
	 * @since 1.0.0
	 */
	public function get( WP_REST_Request $request ) {
		$default  = array(
			'business_name' => '',
			'phone'         => '',
			'address'       => '',
			'logo_url'      => '',
			'socialMedia'   => array(),
		);
		$settings = get_option( $this->option_key, $default );
		$settings = is_array( $settings ) && ! empty( $settings ) ? $settings : $default;
		return $this->get_success_response_data( $settings );
	}

	/**
	 * Function used to validate a phone number
	 *
	 * @param mixed $number phone number to validate.
	 * @return bool
	 * @since 1.0.0
	 */
	public function phone_number_validation( $number ) {
		$phone_number_validation_regex = '/^\\+?\\d{1,4}?[-.\\s]?\\(?\\d{1,3}?\\)?[-.\\s]?\\d{1,4}[-.\\s]?\\d{1,4}[-.\\s]?\\d{1,9}$/';
		return preg_match( $phone_number_validation_regex, $number );
	}

}
