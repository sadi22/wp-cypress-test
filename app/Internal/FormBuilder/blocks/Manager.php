<?php
/**
 * Mail Mint
 *
 * @author [MRM Team]
 * @email [support@rextheme.com]
 * @create date 2022-08-09 11:03:17
 * @modify date 2022-08-09 11:03:17
 * @package /app/Internal/FomrBuilder/blocks/
 */

namespace Mint\MRM\Internal\FormBuilder;

/**
 * BlockTypesController class.
 *
 * @since 5.0.0
 * @internal
 */
final class GetMRMBlockManager {

	/**
	 * Instance
	 *
	 * @since 1.0.0
	 *
	 * @access private
	 * @static
	 *
	 * @var GetMRMBlockManager The single instance of the class.
	 */
	private static $instance = null;


	/**
	 * Instance
	 *
	 * Ensures only one instance of the class is loaded or can be loaded.
	 *
	 * @return GetMRMBlockManager An instance of the class.
	 * @since 1.0.0
	 *
	 * @access public
	 * @static
	 */
	public static function get_instance() {
		if ( is_null( self::$instance ) ) {
			self::$instance = new self();
		}
		return self::$instance;
	}

	/**
	 * Call Class construct for run wp action hook
	 */
	public function __construct() {
		$this->init();
	}

	/**
	 * Initialize class features.
	 */
	protected function init() {
		add_action( 'init', array( $this, 'register_assets' ) );
		add_action( 'init', array( $this, 'register_blocks' ) );
		add_action( 'wp_footer', array( $this, 'wpfnl_inline_footer_scripts' ) );
		add_action( 'wp_head', array( $this, 'add_block_inline_css' ), 100 );
	}

	/**
	 * Register blocks, hooking up assets and render functions as needed.
	 */
	public function register_blocks() {
		$block_types = $this->get_block_types();

		foreach ( $block_types as $block_type ) {
			$block_type_class    = 'MRMForm' . $block_type;
			$block_type_instance = new $block_type_class();
		}
	}


	/**
	 * Get list of block types.
	 *
	 * @return array
	 */
	protected function get_block_types() {
		return array(
			'MRMSubscribeForm',
		);
	}


	/**
	 * Register assets for gutenberg
	 *
	 * @since 2.0.3
	 */
	public function register_assets() {
		wp_register_style( 'getwpf-blocks-editor-style', MRM_DIR_URL . '/app/Internal/FormBuilder/blocks/assets/dist/getwpf-blocks-editor-style.css', array(), '1.0.5', 'all' );
		wp_register_style( 'getwpf-blocks-style', MRM_DIR_URL . '/app/Internal/FormBuilder/blocks/assets/dist/getwpf-blocks-style.css', array(), '1.0.5', 'all' );
	}


	/**
	 * Load Inline Footer Script
	 *
	 * @since 1.3.0
	 */
	public function wpfnl_inline_footer_scripts() {
		global $wp_query;
		$is_previewing = $wp_query->is_preview();
		$can_edit      = current_user_can( 'edit_posts' );
		if ( $is_previewing || $can_edit ) {
			?>
			<script>
				// Set Preview CSS
				document.addEventListener("DOMContentLoaded", function() {
					const cussrent_url = window.location.href;
					let cssInline = document.createElement('style');
					cssInline.type = 'text/css';
					cssInline.id = 'wpfnl-block-js-preview';
					cssInline.innerHTML =JSON.parse( localStorage.getItem('mrmTypographyCSS'));
					window.document.getElementsByTagName("head")[0].appendChild(cssInline);
				})
			</script>
			<?php
		}
	}


	/**
	 * Check current post page open and css path exists
	 * Then read the css file content from css path
	 * Then add inline css to the header
	 */
	public function add_block_inline_css() {
		$upload_dir     = wp_get_upload_dir();
		$upload_css_dir = trailingslashit( $upload_dir['basedir'] );
		$post_id        = get_the_ID();
		if ( $post_id ) {
			$css_path  = $upload_css_dir . "wpfunnels/css/wpfnl-css-{$post_id}.css";
			$json_path = $upload_css_dir . "wpfunnels/css/wpfnl-json-{$post_id}.json";

			if ( file_exists( $css_path ) ) {
				$block_css = file_get_contents( $css_path ); //phpcs:ignore
				echo '<style type="text/css">' . $block_css . '</style>'; //phpcs:ignore
			} else {
				echo '<style type="text/css">' . get_post_meta( get_the_ID(), '_wpfunnels_gb_css', true ) . '</style>'; //phpcs:ignore
			}
		}
	}
}
