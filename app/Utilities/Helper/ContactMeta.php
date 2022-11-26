<?php
/**
 * Contact data helper.
 *
 * @package Mint\MRM\Utilites\Helper
 * @namespace Mint\MRM\Utilites\Helper
 * @author [MRM Team]
 * @email [support@rextheme.com]
 * @create date 2022-08-09 11:03:17
 * @modify date 2022-08-09 11:03:17
 */

namespace Mint\MRM\Utilites\Helper;

use Mint\MRM\DataBase\Tables\ContactMetaSchema;
use Mint\MRM\DataBase\Tables\ContactSchema;

/**
 * ContactData class
 *
 * Contact data helper class.
 *
 * @package Mint\MRM\Utilites\Helper
 * @namespace Mint\MRM\Utilites\Helper
 *
 * @version 1.0.0
 */
class ContactData {

	/**
	 * Get contact meta value from contact meta table
	 *
	 * @param int    $contact_id contact id.
	 * @param string $meta_key meta key.
	 * @return string|null
	 * @since 1.0.0
	 */
	public static function get_meta( $contact_id, $meta_key ) {
		global $wpdb;

		$meta_table_name = $wpdb->prefix . ContactMetaSchema::$table_name;
		// phpcs:disable WordPress.DB.PreparedSQL.InterpolatedNotPrepared
		// phpcs:disable WordPress.DB.PreparedSQL.NotPrepared
		$sql = $wpdb->prepare( "SELECT `meta_value` FROM {$meta_table_name} WHERE `contact_id` = %d AND `meta_key` = %s", array( $contact_id, $meta_key ) );

		return $wpdb->get_var( $sql ); // db call ok. ; no-cache ok.
	}

	/**
	 * Get contact info from contact table
	 *
	 * @param int    $contact_id contact id.
	 * @param string $key meta key.
	 * @return string|null
	 * @since 1.0.0
	 */
	public static function get_info( $contact_id, $key ) {
		global $wpdb;

		$table_name = $wpdb->prefix . ContactSchema::$table_name;

		$sql = "SELECT `{$key}` FROM {$table_name} WHERE `id` = %d";
		$sql = $wpdb->prepare( $sql, $contact_id );

		return $wpdb->get_var( $sql ); // db call ok. ; no-cache ok.
		// phpcs:enable WordPress.DB.PreparedSQL.InterpolatedNotPrepared
		// phpcs:enable WordPress.DB.PreparedSQL.NotPrepared
	}
}
