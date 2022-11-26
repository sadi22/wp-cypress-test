<?php
/**
 * The plugin bootstrap file
 *
 * This file is read by WordPress to generate the plugin information in the plugin
 * admin area. This file also includes all of the dependencies used by the plugin,
 * registers the activation and deactivation functions, and defines a function
 * that starts the plugin.
 *
 * @link              https://mintemail.co
 * @since             1.0.0
 * @package           MintEmail
 *
 * @wordpress-plugin
 * Plugin Name:       Mint Email
 * Plugin URI:        https://mintemail.co
 * Description:       Advanced WordPress CRM to easily collect leads, run email campaigns, set up automation, and many more.
 * Version:           rc-1.0.0
 * Author:            Mint Email Team
 * Author URI:        https://mintemail.co
 * License:           GPL-2.0+
 * License URI:       http://www.gnu.org/licenses/gpl-2.0.txt
 * Text Domain:       mrm
 * Domain Path:       /languages
 */

// If this file is called directly, abort.
if ( ! defined( 'WPINC' ) ) {
	die;
}

/**
 * Currently plugin version.
 * Start at version 1.0.0 and use SemVer - https://semver.org
 * Rename this for your plugin and update it as you release new versions.
 */
define( 'MRM_VERSION', 'rc-1.0.0' );
define( 'MRM_PLUGIN_NAME', 'mrm' );
define( 'MRM_FILE', __FILE__ );
define( 'MRM_DIR_PATH', plugin_dir_path( __FILE__ ) );
define( 'MRM_IMPORT_DIR', WP_CONTENT_DIR . '/uploads/mrm/mrm-import' );
define( 'MRM_DIR_URL', plugins_url( '/', __FILE__ ) );


/**
 * The code that runs during plugin activation.
 * This action is documented in includes/class-mrm-activator.php
 */
function activate_mrm() {
	require_once plugin_dir_path( __FILE__ ) . 'includes/class-mrm-activator.php';
	Mrm_Activator::activate();
}

/**
 * The code that runs during plugin deactivation.
 * This action is documented in includes/class-mrm-deactivator.php
 */
function deactivate_mrm() {
	require_once plugin_dir_path( __FILE__ ) . 'includes/class-mrm-deactivator.php';
	Mrm_Deactivator::deactivate();
}

register_activation_hook( __FILE__, 'activate_mrm' );
register_deactivation_hook( __FILE__, 'deactivate_mrm' );

/**
 * The core plugin class that is used to define internationalization,
 * admin-specific hooks, and public-facing site hooks.
 */
require plugin_dir_path( __FILE__ ) . 'includes/class-mrm.php';

/**
 * Begins execution of the plugin.
 *
 * Since everything within the plugin is registered via hooks,
 * then kicking off the plugin from this point in the file does
 * not affect the page life cycle.
 *
 * @since    1.0.0
 */
function run_mrm() {
	Mrm::instance();
}
run_mrm();



if ( ! function_exists( 'mmempty' ) ) {
	/**
	 * Determine if a value is empty
	 *
	 * @param string $name Name of the prop .
	 * @param null   $array array .
	 * @return bool True if empty otherwise false.
	 *
	 * @since 1.0.0
	 */
	function mmempty( $name, $array = null ) {
		if ( is_array( $name ) ) {
			return empty( $name );
		}

		if ( ! $array ) {
			$array = $_POST; //phpcs:ignore
		}

		$val = mmarval( $array, $name );

		return empty( $val );
	}
}




if ( ! function_exists( 'mmarval' ) ) {

	/**
	 * Get an specific property of an array
	 *
	 * @param array  $array Array of which the property value should be retrieved.
	 * @param string $prop Name of the property to be retrieved.
	 * @param null   $default Default value if no value is found with that name .
	 * @return mixed|string|null
	 *
	 * @since 1.0.0
	 */
	function mmarval( $array, $prop, $default = null ) {
		if ( ! is_array( $array ) && ! ( is_object( $array ) && $array instanceof ArrayAccess ) ) {
			return $default;
		}

		if ( isset( $array[ $prop ] ) ) {
			$value = $array[ $prop ];
		} else {
			$value = '';
		}
		return empty( $value ) && null !== $default ? $default : $value;
	}
}
