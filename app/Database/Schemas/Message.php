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

require_once MRM_DIR_PATH . 'app/Interfaces/Schema.php';

use Mint\MRM\Interfaces\Schema;

/**
 * [Manage message table schema]
 *
 * @desc Manage plugin's assets
 * @package /app/Datanase/Schemas
 * @since 1.0.0
 */
class MessageSchema implements Schema {


	/**
	 * Table name
	 *
	 * @var string
	 * @since 1.0.0
	 */
	public static $table_name = 'mrm_messages';



	/**
	 * Get the schema of Messages table
	 *
	 * @return string
	 * @since 1.0.0
	 */
	public function get_sql() {
		global $wpdb;
		$table = $wpdb->prefix . self::$table_name;

		return "CREATE TABLE IF NOT EXISTS {$table} (
                `id` BIGINT UNSIGNED NOT NULL PRIMARY KEY AUTO_INCREMENT,
                `campaign_id` BIGINT UNSIGNED NULL,
                `message_type` VARCHAR(50) NULL DEFAULT 'email' COMMENT 'SMS, WHATSAPP etc will add in future',
                `contact_id` BIGINT UNSIGNED NULL COMMENT 'Set NULL on contact delete',
                `sender_id` BIGINT(10) UNSIGNED NULL,
                `email_address` VARCHAR(192) NOT NULL,
                `email_subject` VARCHAR(192) NULL,
                `email_preview_text` VARCHAR(192) NULL,
                `email_body` LONGTEXT NULL,
                `email_headers` TEXT NULL,
                `first_open` TIMESTAMP DEFAULT NULL,
                `first_click` TIMESTAMP DEFAULT NULL,
                `click_count` INT NULL,
                `status` VARCHAR(50) NOT NULL DEFAULT 'sent' COMMENT 'SENT, BOUNCED, FAILED',
                `created_at` TIMESTAMP NULL,
                `updated_at` TIMESTAMP NULL,
                INDEX `campaign_id_index` (`campaign_id` DESC),
                INDEX `contact_id_index` (`contact_id` DESC)
             ) ";
	}
}
