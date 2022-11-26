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

namespace MRM\Helpers\Importer;

use Mint\MRM\Constants;
use WP_User_Query;

/**
 * Helper class for manage Import functionalities
 *
 * @package /app
 * @since 1.0.0
 */
class MRM_Importer {

	/**
	 * Create import from CSV file
	 *
	 * @param array|object $file File array/object.
	 * @param string       $delimiter CSV delimiter.
	 *
	 * @return array
	 * @since 1.0.0
	 */
	public static function create_csv_from_import( $file, $delimiter = ',' ) {
		$import_meta = array(
			'import_type' => 'csv',
			'delimiter'   => $delimiter,
		);

		/**
		 * CSV file import directory
		 */
		if ( ! file_exists( MRM_IMPORT_DIR . '/' ) ) {
			wp_mkdir_p( MRM_IMPORT_DIR );
		}

		$file_name = isset( $file[ 'name' ] ) ? $file[ 'name' ] : '';
		$tmp_name  = isset( $file[ 'tmp_name' ] ) ? $file[ 'tmp_name' ] : '';

		/**
		 * Move the file to the directory
		 */
		$new_file_name = md5( wp_rand() . time() ) . '-' . $file_name;
		$new_file      = MRM_IMPORT_DIR . '/' . $new_file_name;
		$move_new_file = @move_uploaded_file( $tmp_name, $new_file ); //phpcs:ignore

		if ( false === $move_new_file ) {
			return __( 'Unable to upload CSV file', 'mrm' );
		}

		$import_meta[ 'file' ]          = $new_file;
		$import_meta[ 'new_file_name' ] = $new_file_name;

		return $import_meta;
	}


	/**
	 * Prepare mapping headers from uploaded CSV and custom fields
	 *
	 * @param string $csv_file CSV file path.
	 * @param string $delimiter CSV delimiter.
	 *
	 * @return array
	 * @since 1.0.0
	 */
	public static function prepare_mapping_options_from_csv( $csv_file, $delimiter ) {
		$handle = fopen( $csv_file, 'r' ); //phpcs:ignore

		/**
		 * Fetching CSV header
		 */
		$headers = false !== $handle ? fgetcsv( $handle, 0, $delimiter ) : false;

		if ( ! is_array( $headers ) && empty( $headers ) ) {
			$headers = array();
		}

		if ( isset( $headers[ 0 ] ) ) {
			$headers[ 0 ] = self::remove_utf8_bom( $headers[ 0 ] );
		}

		/**
		 * Get existing contact fields
		 */
		$contact_attrs = Constants::$contacts_attrs;

		return array(
			'headers' => $headers,
			'fields'  => $contact_attrs,
		);
	}


	/**
	 * Remove UTF8_bom
	 *
	 * @param string $string String.
	 *
	 * @return string
	 */
	public static function remove_utf8_bom( $string ) {
		if ( 'efbbbf' === substr( bin2hex( $string ), 0, 6 ) ) {
			$string = substr( $string, 3 );
		}

		return $string;
	}


	/**
	 * Returns all WordPress core user roles
	 *
	 * @return array
	 * @since 1.0.0
	 */
	public static function get_wp_roles() {
		if ( ! function_exists( 'get_editable_roles' ) ) {
			require_once ABSPATH . 'wp-admin/includes/user.php';
		}

		// Get and formatting editable roles.
		$editable_roles = get_editable_roles();
		if ( ! is_array( $editable_roles ) || empty( $editable_roles ) ) {
			return __( 'WordPress user roles not found', 'mrm' );
		}
		foreach ( $editable_roles as $role => $details ) {
			$sub[ 'role' ] = esc_attr( $role );
			$sub[ 'name' ] = translate_user_role( $details[ 'name' ] );
			$roles[]       = $sub;
		}

		return $roles;
	}


	/**
	 * Import WP users information from users and users metadata table
	 *
	 * @param array $roles WP user roles.
	 *
	 * @return array
	 * @since 1.0.0
	 */
	public static function get_wp_users( $roles = array() ) {
		$users = get_users(
			array(
				'role__in' => $roles,
				'orderby'  => 'ID',
				'order'    => 'ASC',
			)
		);

		return array_map(
			function( $user ) {
				$user->usermeta = array_map(
					function( $user_data ) {
						return reset( $user_data );
					},
					get_user_meta( $user->ID )
				);

				return $user;
			},
			$users
		);
	}


	/**
	 * Import WC customers information from orders and metadata table
	 *
	 * @return array
	 * @since 1.0.0
	 */
	public static function get_wc_customers() {
		$all_order_ids = wc_get_orders(
			array(
				'return'       => 'ids',
				'numberposts'  => '-1',
				'type'         => 'shop_order',
				'parent'       => 0,
				'date_created' => '<' . time(),
				'status'       => wc_get_is_paid_statuses(),
			)
		);

		$customers = array_map(
			function( $all_order_id ) {
				$orders = wc_get_order( $all_order_id );

				return $orders->data[ 'billing' ];
			},
			$all_order_ids
		);
		/**
		 * Count orders
		 */
		$order_count = count( $all_order_ids );

		return $customers;
	}
}
