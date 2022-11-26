<?php
/**
 * Fired during plugin activation
 *
 * @link       http://rextheme.com/
 * @since      1.0.0
 *
 * @package    Mrm
 * @subpackage Mrm/includes
 */

/**
 * Fired during plugin activation.
 *
 * This class defines all code necessary to run during the plugin's activation.
 *
 * @since      1.0.0
 * @package    Mrm
 * @subpackage Mrm/includes
 * @author     RexTheme <support@rextheme.com>
 */
class Mrm_Activator {

	/**
	 * Process all activation tasks
	 *
	 * @since    1.0.0
	 */
	public static function activate() {
		require_once MRM_DIR_PATH . 'app/Database/Upgrade.php';

		$upgrade = \Mint\MRM\DataBase\Upgrade::get_instance();
		$upgrade->maybe_upgrade();
	}

}
