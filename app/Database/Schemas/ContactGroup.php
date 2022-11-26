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
 * [Manage contact group schema]
 *
 * @desc Manage plugin's assets
 * @package /app/Datanase/Schemas
 * @since 1.0.0
 */
class ContactGroupSchema implements Schema {

	/**
	 * Table name
	 *
	 * @var string
	 * @since 1.0.0
	 */
	public static $table_name = 'mrm_contact_groups';

	/**
	 * Get the schema of ContactGroup table
	 *
	 * @return string
	 * @since 1.0.0
	 */
	public function get_sql() {
		global $wpdb;
		$table = $wpdb->prefix . self::$table_name;

		return "CREATE TABLE IF NOT EXISTS {$table} (
            `id` BIGINT(20) unsigned NOT NULL auto_increment,
            `title` VARCHAR(255) NOT NULL,
            `type` VARCHAR(192) NOT NULL COMMENT 'tags, lists, segments',
            `slug` VARCHAR(255) NOT NULL,
            `data` longtext, 
            `created_at` TIMESTAMP,
            `updated_at` TIMESTAMP,
           PRIMARY KEY (`id`),
           KEY `type` (`type`)
         ) ;";
	}
}
