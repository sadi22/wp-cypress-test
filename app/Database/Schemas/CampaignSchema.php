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
 * [Manage campaign schema]
 *
 * @desc Manage plugin's assets
 * @package /app/Datanase/Schemas
 * @since 1.0.0
 */
class CampaignSchema {

	/**
	 * Table name for mrm_campaigns
	 *
	 * @var string
	 * @since 1.0.0
	 */
	public static $campaign_table = 'mrm_campaigns';

	/**
	 * Table name for mrm_campaigns_meta
	 *
	 * @var string
	 * @since 1.0.0
	 */
	public static $campaign_meta_table = 'mrm_campaigns_meta';

	/**
	 * Table name for mrm_campaign_emails
	 *
	 * @var string
	 * @since 1.0.0
	 */
	public static $campaign_emails_table = 'mrm_campaign_emails';

	/**
	 * Table name for mrm_campaign_emails_meta
	 *
	 * @var string
	 * @since 1.0.0
	 */
	public static $campaign_emails_meta_table = 'mrm_campaign_emails_meta';

	/**
	 * Create tables on plugin activation
	 *
	 * @return void
	 * @since 1.0.0
	 */
	public function get_sql() {
		global $wpdb;

		$charset_collate = $wpdb->get_charset_collate();

		// campaigns table.
		$campaign_table = $wpdb->prefix . self::$campaign_table;
		$this->create_campaign_table( $campaign_table, $charset_collate );

		// campaign meta table.
		$campaign_meta_table = $wpdb->prefix . self::$campaign_meta_table;
		$this->create_campaign_meta_table( $campaign_meta_table, $charset_collate );

		// campaign emails table.
		$campaign_emails_table = $wpdb->prefix . self::$campaign_emails_table;
		$this->create_campaign_emails_table( $campaign_emails_table, $charset_collate );

		// campaign emails meta table.
		$campaign_emails_meta_table = $wpdb->prefix . self::$campaign_emails_meta_table;
		$this->create_campaign_emails_meta_table( $campaign_emails_meta_table, $charset_collate );
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
	public function create_campaign_table( $table, $charset_collate ) {
		$sql = "CREATE TABLE IF NOT EXISTS {$table} (
            `id` BIGINT UNSIGNED NOT NULL PRIMARY KEY AUTO_INCREMENT,
            `title` VARCHAR(192) NULL,
            `status` ENUM('draft', 'active', 'archived', 'suspended'),
            `type` ENUM('regular', 'sequence'),
            `scheduled_at` TIMESTAMP NULL,
            `created_by` bigint(20) unsigned NULL,
            `created_at` TIMESTAMP NULL,
            `updated_at` TIMESTAMP NULL,
            INDEX `cid_index` (`id` DESC),
            INDEX `ctitle_index` (`title` DESC)
         ) $charset_collate;";

		dbDelta( $sql );
	}


	/**
	 * Create Campaign meta table
	 *
	 * @param mixed $table Campaign meta table name.
	 * @param mixed $charset_collate Collation and Character Set.
	 *
	 * @return void
	 * @since 1.0.0
	 */
	public function create_campaign_meta_table( $table, $charset_collate ) {
		$sql = "CREATE TABLE IF NOT EXISTS {$table} (
            `id` BIGINT UNSIGNED NOT NULL PRIMARY KEY AUTO_INCREMENT,
            `campaign_id` BIGINT(20) NOT NULL,
            `meta_key` VARCHAR(50) NOT NULL,
            `meta_value` longtext,
            `created_at` TIMESTAMP NULL,
            `updated_at` TIMESTAMP NULL,
            INDEX `campaign_id_index` (`campaign_id` DESC)
         ) $charset_collate;";
		dbDelta( $sql );
	}


	/**
	 * Create Campaign emails table
	 *
	 * @param mixed $table Campaign emails table name.
	 * @param mixed $charset_collate Collation and Character Set.
	 *
	 * @return void
	 * @since 1.0.0
	 */
	public function create_campaign_emails_table( $table, $charset_collate ) {
		$sql = "CREATE TABLE IF NOT EXISTS {$table} (
            `id` BIGINT UNSIGNED NOT NULL PRIMARY KEY AUTO_INCREMENT,
            `campaign_id` BIGINT(20) NOT NULL,
            `delay` INT(10) DEFAULT 0,
            `delay_count` INT(10) NULL,
            `delay_value` VARCHAR(192) NULL,
            `send_time` BIGINT(20) DEFAULT 0,   
            `sender_email` VARCHAR(192),
            `sender_name` VARCHAR(192),
            `email_index` INT(10),
            `email_subject` VARCHAR(192),
            `email_preview_text` VARCHAR(192) NULL,
            `template_id` bigint(20) unsigned NULL,
            `email_body` longtext,
            `email_json` longtext,
            `status` ENUM('draft', 'scheduled', 'sent') DEFAULT 'draft',
            `scheduled_at` TIMESTAMP NULL,
            `created_at` TIMESTAMP NULL,
            `updated_at` TIMESTAMP NULL,
            INDEX `campaign_id_index` (`campaign_id` DESC)
         ) $charset_collate;";

		dbDelta( $sql );
	}


	/**
	 * Create Campaign emails meta table
	 *
	 * @param mixed $table Campaign emails meta table name.
	 * @param mixed $charset_collate Collation and Character Set.
	 *
	 * @return void
	 * @since 1.0.0
	 */
	public function create_campaign_emails_meta_table( $table, $charset_collate ) {
		$sql = "CREATE TABLE IF NOT EXISTS {$table} (
            `id` BIGINT UNSIGNED NOT NULL PRIMARY KEY AUTO_INCREMENT,
            `campaign_emails_id` BIGINT(20) NOT NULL,
            `meta_key` VARCHAR(50) NOT NULL,
            `meta_value` longtext,
            INDEX `campaign_emails_id_index` (`campaign_emails_id` DESC)
         ) $charset_collate;";
		dbDelta( $sql );
	}
}
