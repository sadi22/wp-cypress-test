<?php
/**
 * Mail Mint
 *
 * @author [MRM Team]
 * @email [support@rextheme.com]
 * @create date 2022-08-09 11:03:17
 * @modify date 2022-08-09 11:03:17
 * @package /app
 */

namespace MRM\Common;

use WP_REST_Request;

/**
 * [Manage Common mrm function ]
 *
 * @desc Manages Common function in mrm
 * @package /app/Internal/Ajax
 * @since 1.0.0
 */
class MRM_Common {

	/**
	 * Returns alphanumeric hash
	 *
	 * @param string $email get email .
	 * @param mixed  $len  get lengh .
	 *
	 * @return string
	 */
	public static function get_rand_hash( $email, $len = 32 ) {
		return substr( md5( $email ), -$len );
	}


	/**
	 * Returns request query params or body values
	 *
	 * @param  WP_REST_Request $request Get Request type .
	 *
	 * @return array
	 * @since 1.0.0
	 */
	public static function get_api_params_values( WP_REST_Request $request ) {
		$query_params   = $request->get_query_params();
		$query_params   = is_array( $query_params ) && ! empty( $query_params ) ? self::get_sanitized_get_post( $query_params ) : $query_params;
		$request_params = $request->get_params();
		$request_params = is_array( $request_params ) && ! empty( $request_params ) ? self::get_sanitized_get_post( $request_params ) : $request_params;
		return array_replace( $query_params, $request_params );
	}


	/**
	 * Return created by or author id
	 *
	 * @return int
	 * @since 1.0.0
	 */
	public static function get_current_user_id() {
		if ( is_user_logged_in() ) {
			return get_current_user_id();
		}
		return get_current_user_id();
	}


	/**
	 * Get the possible csv mimes.
	 *
	 * @return array
	 * @since 1.0.0
	 */
	public static function csv_mimes() {
		return apply_filters(
			'mrm_csv_mimes',
			array(
				'text/csv',
				'text/plain',
				'application/csv',
				'text/comma-separated-values',
				'application/excel',
				'application/vnd.ms-excel',
				'application/vnd.msexcel',
				'text/anytext',
				'application/octet-stream',
				'application/txt',
			)
		);
	}


	/**
	 * Create a slug from a string
	 *
	 * @param mixed $str get string .
	 *
	 * @return string
	 * @since 1.0.0
	 */
	public static function create_slug( $str ) {
		return preg_replace( '/[^A-Za-z0-9-]+/', '-', $str );
	}


	/**
	 * Sanitize global variables
	 *
	 * @param array $data get data.
	 *
	 * @return array
	 * @since 1.0.0
	 */
	public static function get_sanitized_get_post( $data = array() ) {
		if ( is_array( $data ) && ! empty( $data ) ) {
			return filter_var_array( $data, FILTER_SANITIZE_FULL_SPECIAL_CHARS );
		}
		return array(
			'get'     => filter_input_array( INPUT_GET, FILTER_SANITIZE_FULL_SPECIAL_CHARS ),
			'post'    => filter_input_array( INPUT_POST, FILTER_SANITIZE_FULL_SPECIAL_CHARS ),
			'request' => filter_var_array( $_REQUEST, FILTER_SANITIZE_FULL_SPECIAL_CHARS ), //phpcs:ignore
		);
	}


	/**
	 * Partially hide or mask email address
	 *
	 * @param mixed $email  get email address .
	 *
	 * @return string
	 * @since 1.0.0
	 */
	public static function obfuscate_email( $email ) {
		$em   = explode( '@', $email );
		$name = implode( '@', array_slice( $em, 0, count( $em ) - 1 ) );
		$len  = floor( strlen( $name ) / 2 );

		return substr( $name, 0, $len ) . str_repeat( '*', $len ) . '@' . end( $em );
	}


}

