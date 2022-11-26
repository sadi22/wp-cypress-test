<?php
/**
 * Mail Mint
 *
 * @author [MRM Team]
 * @email [support@rextheme.com]
 * @create date 2022-08-09 11:03:17
 * @modify date 2022-08-09 11:03:17
 * @package /app/Internal/Admin
 */

namespace Mint\MRM\Internal\Admin;

use Mint\MRM\DataBase\Models\ContactGroupModel;
use Mint\MRM\Internal\Constants;
use Mint\Mrm\Internal\Traits\Singleton;

/**
 * [Manage plugin's admin assets]
 *
 * @desc Manage plugin's admin assets
 * @package /app/Internal/Admin
 * @since 1.0.0
 */
class AdminAssets {

	use Singleton;

	/**
	 * Initialize the plugin functionalities
	 *
	 * @since 1.0.0
	 */
	public function __construct() {
		add_action( 'admin_enqueue_scripts', array( $this, 'enqueue_scripts' ) );
		add_action( 'admin_enqueue_scripts', array( $this, 'enqueue_styles' ) );
		/** Load font and size selector */
		add_filter( 'mce_buttons', array( $this, 'my_mce_buttons_2' ), 999 );
	}

	/**
	 * Add a button in a core button that is disabled by default
	 *
	 * @param array $buttons First-row list of TinyMCE buttons.
	 * @return mixed
	 * @since 1.0.0
	 */
	public function my_mce_buttons_2( array $buttons ) {
		$buttons[] = 'wdm_mce_button';

		return $buttons;
	}

	/**
	 * Load plugin main js file
	 *
	 * @param string $hook Hook suffix of current admin page.
	 *
	 * @return false|void
	 * @since 1.0.0
	 */
	public function enqueue_scripts( string $hook ) {
		if ( ! $this->maybe_mrm_page( $hook ) ) {
			return false;
		}

		// Broadcasts.
		wp_enqueue_editor();
		wp_tinymce_inline_scripts();

		// Enqueue wp media.
		wp_enqueue_media();

		wp_enqueue_script(
			MRM_PLUGIN_NAME . '-select2',
			self::get_url( 'select2', 'js', 'external' ),
			array( 'jquery' ),
			MRM_VERSION,
			true
		);
		wp_enqueue_script(
			MRM_PLUGIN_NAME . '-easy-email',
			MRM_DIR_URL . '/assets/admin/dist/chunks/packages_easy-email-extensions_lib_index3_js.min.js',
			array(),
			MRM_VERSION,
			true
		);
		wp_enqueue_script(
			MRM_PLUGIN_NAME,
			self::get_url( 'main', 'js' ),
			array( 'jquery', MRM_PLUGIN_NAME . '-easy-email' ),
			MRM_VERSION,
			true
		);

		$active_plugings = get_option( 'active_plugins', array() );
		$wc_active       = in_array( 'woocommerce/woocommerce.php', $active_plugings, true ) || is_plugin_active_for_network( 'woocommerce/woocommerce.php' );

		wp_localize_script(
			MRM_PLUGIN_NAME,
			'MRM_Vars',
			array(
				'ajaxurl'            => admin_url( 'admin-ajax.php' ),
				'api_base_url'       => get_rest_url(),
				'nonce'              => wp_create_nonce( 'wp_rest' ),
				'current_userID'     => get_current_user_id(),
				'editor_data_source' => $this->get_editor_source(),
				'timezone_list'      => Constants::get_timezone_list(),
				'admin_url'          => get_admin_url(),
				'countries'          => Constants::get_country_name(),
				'states'             => Constants::get_country_state(),
				'lists'              => ContactGroupModel::get_all_to_custom_select( 'lists' ),
				'tags'               => ContactGroupModel::get_all_to_custom_select( 'tags' ),
				'is_wc_active'       => $wc_active,
			)
		);
	}


	/**
	 * Load plugin main css file
	 *
	 * @param string $hook Hook suffix of current admin page.
	 *
	 * @return false|void
	 * @since 1.0.0
	 */
	public function enqueue_styles( string $hook ) {
		if ( ! $this->maybe_mrm_page( $hook ) ) {
			return false;
		}
		wp_enqueue_style(
			MRM_PLUGIN_NAME . '-select2',
			self::get_url( 'select2', 'css', 'external' ),
			array(),
			MRM_VERSION
		);
		wp_enqueue_style(
			MRM_PLUGIN_NAME,
			self::get_url( 'admin', 'css' ),
			array(),
			MRM_VERSION
		);
	}


	/**
	 * Get assets URL
	 *
	 * @param string $file File name.
	 * @param string $ext File extension.
	 * @param string $type File type.
	 *
	 * @return string
	 * @since 1.0.0
	 */
	public static function get_url( string $file, string $ext, string $type = 'dist' ) {
		$suffix = '';
		// Potentially enqueue minified JavaScript.
		if ( 'js' === $ext ) {
			$script_debug = defined( 'SCRIPT_DEBUG' ) && SCRIPT_DEBUG;
			$suffix       = self::should_use_minified_file( $script_debug ) ? '' : '.min';
			$suffix       = '.min';
		}

		return plugins_url( self::get_path( $ext, $type ) . $file . $suffix . '.' . $ext, MRM_FILE );
	}


	/**
	 * Get the Asset path
	 *
	 * @param string $ext File extension.
	 * @param string $type File type.
	 *
	 * @return mixed
	 * @since 1.0.0
	 */
	public static function get_path( string $ext, string $type = 'dist' ) {
		if ( 'external' === $type ) {
			return ( 'css' === $ext ) ? MRM_ADMIN_EXTERNAL_CSS_FOLDER : MRM_ADMIN_EXTERNAL_JS_FOLDER;
		}

		return ( 'css' === $ext ) ? MRM_ADMIN_DIST_CSS_FOLDER : MRM_ADMIN_DIST_JS_FOLDER;
	}


	/**
	 * Determine if minified file is served
	 *
	 * @param bool $script_debug If script debugging is true/false.
	 *
	 * @return bool
	 * @since 1.0.0
	 */
	public static function should_use_minified_file( bool $script_debug ) {
		return ! $script_debug;
	}


	/**
	 * Check if the current page is CRM page or not
	 *
	 * @param string $hook Hook suffix of current admin page.
	 *
	 * @return bool
	 * @since 1.0.0
	 */
	private function maybe_mrm_page( string $hook ) {
		return 'toplevel_page_mrm-admin' === $hook;
	}


	/**
	 * Get editor source data
	 *
	 * @return array
	 * @since 1.0.0
	 */
	private function get_editor_source() {
		// get product categories for email builder.
		$categories = $this->get_formatted_wc_categories();

		return apply_filters(
			'plugin_hook_name',
			array(
				'product_categories' => $categories,
			)
		);
	}


	/**
	 * Get the WooCommerce product categories
	 *
	 * @return array
	 * @since 1.0.0
	 */
	private function get_formatted_wc_categories() {
		$taxonomy     = 'product_cat';
		$orderby      = 'name';
		$show_count   = 0;
		$pad_counts   = 0;
		$hierarchical = 1;
		$title        = '';
		$empty        = 0;

		$args               = array(
			'taxonomy'     => $taxonomy,
			'orderby'      => $orderby,
			'show_count'   => $show_count,
			'pad_counts'   => $pad_counts,
			'hierarchical' => $hierarchical,
			'title_li'     => $title,
			'hide_empty'   => $empty,
		);
		$product_categories = get_categories( $args );
		$wc_categories      = array();
		foreach ( $product_categories as $product_cat ) {
			$wc_categories[] = array(
				'value' => $product_cat->term_id,
				'label' => $product_cat->name,
			);
		}

		return $wc_categories;
	}
}
