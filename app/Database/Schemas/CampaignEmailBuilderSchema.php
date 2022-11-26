<?php
/**
 * Mail Mint
 *
 * @author [MRM Team]
 * @email [support@rextheme.com]
 * @create date 2022-08-09 11:03:17
 * @modify date 2022-08-09 11:03:17
 * @package /app/Datanase/Schemas
 */

namespace Mint\MRM\DataBase\Tables;

require_once ABSPATH . 'wp-admin/includes/upgrade.php';

/**
 * [Manage campaign email builder schema]
 *
 * @desc Manage plugin's assets
 * @package /app/Datanase/Schemas
 * @since 1.0.0
 */
class CampaignEmailBuilderSchema {
	/**
	 * Table name for mrm_campaigns
	 *
	 * @var string
	 * @since 1.0.0
	 */
	public static $table_name = 'mrm_campaign_email_builder';

	/**
	 * Create tables on plugin activation
	 *
	 * @return void
	 * @since 1.0.0
	 */
	public function get_sql() {
		global $wpdb;

		$charset_collate = $wpdb->get_charset_collate();

		// campaign email builder table.
		$campaign_email_builder_table = $wpdb->prefix . self::$table_name;
		$this->create_campaign_email_builder_table( $campaign_email_builder_table, $charset_collate );
	}


	/**
	 * Create Campaign table
	 *
	 * @param mixed $table Campaign table name.
	 * @param mixed $charset_collate Collation and Character Set.
	 *
	 * @return void
	 * @since 1.0.0
	 */
	public function create_campaign_email_builder_table( $table, $charset_collate ) {
		$sql = "CREATE TABLE IF NOT EXISTS {$table} (
            `id` BIGINT UNSIGNED NOT NULL PRIMARY KEY AUTO_INCREMENT,
            `email_id` BIGINT UNSIGNED NOT NULL,
            `status` ENUM('draft', 'published'),
            `email_body` longtext,
            `json_data` longtext,
            `created_at` TIMESTAMP NULL,
            `updated_at` TIMESTAMP NULL,
            INDEX `email_id_index` (`email_id` DESC)
         ) $charset_collate;";
		dbDelta( $sql );
	}
}
