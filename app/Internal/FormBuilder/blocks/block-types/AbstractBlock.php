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

/**
 * [AbstractBlock class].
 *
 * @desc Manages Guternburg Block in mrm
 * @package /app/Internal/Ajax
 * @since 1.0.0
 */
abstract class GetMRMAbstractBlock {


	/**
	 * Block namespace.
	 *
	 * @var string
	 */
	protected $namespace = 'mrmformfield';

	/**
	 * Block name within this namespace.
	 *
	 * @var string
	 */
	protected $block_name = '';

	/**
	 * Tracks if assets have been enqueued.
	 *
	 * @var boolean
	 */
	protected $enqueued_assets = false;

	/**
	 * Instance of the asset API.
	 *
	 * @var AssetApi
	 */
	protected $asset_api;

	/**
	 * Instance of the asset data registry.
	 *
	 * @var AssetDataRegistry
	 */
	protected $asset_data_registry;


	/**
	 * Constructor.
	 *
	 * @param string $block_name Optionally set block name during construct.
	 */
	public function __construct( $block_name = '' ) {
		$this->block_name = $block_name ? $block_name : $this->block_name;
		add_action( 'enqueue_block_editor_assets', array( $this, 'enqueue_editor_assets' ) );
		$this->initialize();
	}




	/**
	 * Initialize this block type.
	 *
	 * - Hook into WP lifecycle.
	 * - Register the block with WordPress.
	 */
	protected function initialize() {
		$this->register_block_type_assets();
		$this->register_block_type();
	}


	/**
	 * Registers the block type with WordPress.
	 */
	protected function register_block_type() {
		register_block_type(
			$this->get_block_type(),
			array(
				'editor_script' => $this->get_block_type_editor_script( 'handle' ),
				'editor_style'  => $this->get_block_type_editor_style(),
				'style'         => $this->get_block_type_style(),
				'attributes'    => $this->get_block_type_attributes(),
				'supports'      => $this->get_block_type_supports(),
			)
		);
	}

	/**
	 * Get the render callback for this block type.
	 *
	 * Dynamic blocks should return a callback, for example, `return [ $this, 'render' ];`
	 *
	 * @see $this->register_block_type()
	 * @return callable|null;
	 */
	protected function get_block_type_render_callback() {
		return array( $this, 'render_callback' );
	}


	/**
	 * The default render_callback for all blocks. This will ensure assets are enqueued just in time, then render
	 * the block (if applicable).
	 *
	 * @param array|WP_Block $attributes Block attributes, or an instance of a WP_Block. Defaults to an empty array.
	 * @param string         $content    Block content. Default empty string.
	 * @return string Rendered block type output.
	 */
	public function render_callback( $attributes = array(), $content = '' ) {
		$render_callback_attributes = $this->parse_render_callback_attributes( $attributes );
		$this->enqueue_assets( $render_callback_attributes );
		return $this->render( $render_callback_attributes, $content );
	}

	/**
	 * Get the editor script data for this block type.
	 *
	 * @see $this->register_block_type()
	 * @param string $key Data to get, or default to everything.
	 * @return array|string
	 */
	protected function get_block_type_editor_script( $key = null ) {
		$script = array(
			'handle'       => 'getwpf-' . $this->block_name,
			'path'         => $this->get_block_asset_build_path( 'getwpf-' . $this->block_name ),
			'dependencies' => array( 'wp-blocks', 'wp-i18n', 'wp-element', 'wp-editor', 'wp-api-fetch' ),
		);
		return $key ? $script[ $key ] : $script;
	}

	/**
	 * Get block asset Build path
	 *
	 * @param string $filename get register filename .
	 * @param string $type get register file type .
	 *
	 * @return string
	 */
	protected function get_block_asset_build_path( $filename, $type = 'js' ) {
		global $wp_version;
		$suffix = version_compare( $wp_version, '5.3', '>=' )
			? ''
			: '-legacy';
		return "assets/dist/$filename$suffix.$type";
	}

	/**
	 * Enqueue assets used for rendering the block in editor context.
	 *
	 * This is needed if a block is not yet within the post content--`render` and `enqueue_assets` may not have ran.
	 */
	public function enqueue_editor_assets() {
		if ( $this->enqueued_assets ) {
			return;
		}
		$this->enqueue_data();
	}


	/**
	 * Register script and style assets for the block type before it is registered.
	 *
	 * This registers the scripts; it does not enqueue them.
	 */
	protected function register_block_type_assets() {
		if ( null !== $this->get_block_type_editor_script() ) {
            $post_id   = isset( $_GET['post'] ) ? intval( $_GET['post'] ) : 0; //phpcs:ignore
			$post_type = get_post_type( $post_id );
			if ( 'mrmform' === $post_type ) {
				$handle = $this->get_block_type_editor_script( 'handle' );
				$this->register_script(
					$handle,
					$this->get_block_type_editor_script( 'path' ),
					$this->get_block_type_editor_script( 'dependencies' )
				);
			}

				$handle = $this->get_block_type_editor_script( 'handle' );
			if ( 'getwpf-mrm-subscribe-form' === $handle ) {
				$this->register_script(
					$handle,
					$this->get_block_type_editor_script( 'path' ),
					$this->get_block_type_editor_script( 'dependencies' )
				);
			}
		}
		if ( null !== $this->get_block_type_script() ) {
			$handle = $this->get_block_type_script( 'handle' );
			$this->register_script(
				$handle,
				$this->get_block_type_script( 'path' ),
				array( 'wp-blocks', 'wp-i18n', 'wp-element', 'wp-editor', 'wp-api-fetch' )
			);
		}
	}

	/**
	 * Register Script data
	 *
	 * @param string $handle manage handle .
	 * @param string $relative_src get handle src .
	 * @param array  $dependencies script dependency .
	 * @param array  $has_i18n manage language .
	 *
	 * @return void
	 */
	public function register_script( $handle, $relative_src, $dependencies = array(), $has_i18n = true ) {
		$src     = '';
		$version = '1.0.5';

		if ( $relative_src ) {
			$src = $this->get_asset_url( $relative_src );
		}
		wp_register_script( $handle, $src, apply_filters( 'mrm_gutenberg_blocks_register_script_dependencies', $dependencies, $handle ), $version, true );

		if ( is_admin() ) {
			wp_localize_script(
				$handle,
				'getwpf_block_object',
				array(
					'siteUrl' => get_site_url(),
					'ajaxUrl' => admin_url( 'admin-ajax.php' ),
					'nonce'   => wp_create_nonce( 'wp_rest' ),
					'theme'   => MRM_DIR_URL,
				)
			);
		}
	}

	/**
	 * Get asset url
	 *
	 * @param string $relative_url get Url .
	 *
	 * @return string
	 */
	public function get_asset_url( $relative_url ) {
		return MRM_DIR_URL . '/app/Internal/FormBuilder/blocks/' . $relative_url;
	}


	/**
	 * Returns the path to the plugin directory.
	 *
	 * @param string $relative_path  If provided, the relative path will be
	 *                               appended to the plugin path.
	 *
	 * @return string
	 */
	public function get_path( $relative_path = '' ) {
		return trailingslashit( MRM_DIR_PATH . '/app/Internal/FormBuilder/blocks' ) . $relative_path;
	}

	/**
	 * Get the file modified time as a cache buster if we're in dev mode.
	 *
	 * @param string $file Local path to the file (relative to the plugin
	 *                     directory).
	 * @return string The cache buster value to use for the given file.
	 */
	protected function get_file_version( $file ) {
		return '2.0.3';
	}

	/**
	 * Get the block type.
	 *
	 * @return string
	 */
	protected function get_block_type() {
		return $this->namespace . '/' . $this->block_name;
	}


	/**
	 * Get the editor style handle for this block type.
	 *
	 * @see $this->register_block_type()
	 * @return string|null
	 */
	protected function get_block_type_editor_style() {
		return 'getwpf-blocks-editor-style';
	}


	/**
	 * Get the frontend script handle for this block type.
	 *
	 * @see $this->register_block_type()
	 * @param string $key Data to get, or default to everything.
	 * @return array|string
	 */
	protected function get_block_type_script( $key = null ) {
		$script = array(
			'handle'       => 'getwpf-' . $this->block_name . '-frontend',
			'path'         => $this->get_block_asset_build_path( 'getwpf-' . $this->block_name . '-frontend' ),
			'dependencies' => array( 'wp-blocks' ),
		);
		return $key ? $script[ $key ] : $script;
	}



	/**
	 * Get the frontend style handle for this block type.
	 *
	 * @see $this->register_block_type()
	 * @return string|null
	 */
	protected function get_block_type_style() {
		return 'getwpf-blocks-style';
	}

	/**
	 * Get the supports array for this block type.
	 *
	 * @see $this->register_block_type()
	 * @return string;
	 */
	protected function get_block_type_supports() {
		return array();
	}

	/**
	 * Get block attributes.
	 *
	 * @return array|null;
	 */
	protected function get_block_type_attributes() {
		return null;
	}

	/**
	 * Parses block attributes from the render_callback.
	 *
	 * @param array|WP_Block $attributes Block attributes, or an instance of a WP_Block. Defaults to an empty array.
	 * @return array
	 */
	protected function parse_render_callback_attributes( $attributes ) {
		return is_a( $attributes, 'WP_Block' ) ? $attributes->attributes : $attributes;
	}

	/**
	 * Render the block. Extended by children.
	 *
	 * @param array  $attributes Block attributes.
	 * @param string $content    Block content.
	 * @return string Rendered block type output.
	 */
	protected function render( $attributes, $content ) {
		return $content;
	}

	/**
	 * Enqueue frontend assets for this block, just in time for rendering.
	 *
	 * @internal This prevents the block script being enqueued on all pages. It is only enqueued as needed. Note that
	 * we intentionally do not pass 'script' to register_block_type.
	 *
	 * @param array $attributes  Any attributes that currently are available from the block.
	 */
	protected function enqueue_assets( array $attributes ) {
		if ( $this->enqueued_assets ) {
			return;
		}
		$this->enqueue_scripts( $attributes );
		$this->enqueued_assets = true;
	}

	/**
	 * Injects block attributes into the block.
	 *
	 * @param string $content HTML content to inject into.
	 * @param array  $attributes Key value pairs of attributes.
	 * @return string Rendered block with data attributes.
	 */
	protected function inject_html_data_attributes( $content, array $attributes ) {
		return preg_replace( '/<div /', '<div ' . $this->get_html_data_attributes( $attributes ) . ' ', $content, 1 );
	}

	/**
	 * Converts block attributes to HTML data attributes.
	 *
	 * @param array $attributes Key value pairs of attributes.
	 * @return string Rendered HTML attributes.
	 */
	protected function get_html_data_attributes( array $attributes ) {
		$data = array();

		foreach ( $attributes as $key => $value ) {
			if ( is_bool( $value ) ) {
				$value = $value ? 'true' : 'false';
			}
			if ( ! is_scalar( $value ) ) {
				$value = wp_json_encode( $value );
			}
			$data[] = 'data-' . esc_attr( strtolower( preg_replace( '/(?<!\ )[A-Z]/', '-$0', $key ) ) ) . '="' . esc_attr( $value ) . '"';
		}

		return implode( ' ', $data );
	}

	/**
	 * Data passed through from server to client for block.
	 *
	 * @param array $attributes  Any attributes that currently are available from the block.
	 *                           Note, this will be empty in the editor context when the block is
	 *                           not in the post content on editor load.
	 */
	protected function enqueue_data( array $attributes = array() ) {
	}

	/**
	 * Register/enqueue scripts used for this block on the frontend, during render.
	 *
	 * @param array $attributes Any attributes that currently are available from the block.
	 */
	protected function enqueue_scripts( array $attributes = array() ) {
		if ( null !== $this->get_block_type_script() ) {
			wp_enqueue_script( $this->get_block_type_script( 'handle' ) );
		}
	}


	/**
	 * Generate assets
	 *
	 * @param string $attributes get attributes.
	 * @return array|void
	 *
	 * @since 1.0.0
	 */
	protected function generate_assets( $attributes ) {
		global $post;
		if ( ! is_object( $post ) ) {
			return;
		}
		return $this->get_generated_dynamic_styles( $attributes, $post );
	}

	/**
	 * Get Dynamic css
	 *
	 * @param string $attributes css attribute.
	 * @param object $post get post .
	 *
	 * @return array
	 */
	protected function get_generated_dynamic_styles( $attributes, $post ) {
		return array();
	}


	/**
	 * It will generate css from multidimensional array recursively
	 *
	 * @param array $rules get rule se .
	 *   An array of CSS rules in the form of:
	 *   array('selector'=>array('property' => 'value')). Also supports selector
	 *   nesting, e.g.,
	 *   array('selector' => array('selector'=>array('property' => 'value'))).
	 *
	 * @param int   $indent get indent .
	 * @return string
	 *
	 * @since 1.0.0
	 * @source https://matthewgrasmick.com/posts/convert-nested-php-array-css-string
	 */
	protected function generate_css( $rules, $indent = 0 ) {
		$css    = '';
		$prefix = str_repeat( '  ', $indent );

		foreach ( $rules as $key => $value ) {
			if ( is_array( $value ) ) {
				$selector   = $key;
				$properties = $value;

				$css .= $prefix . "$selector {\n";
				$css .= $prefix . $this->generate_css( $properties, $indent + 1 );
				$css .= $prefix . "}\n";
			} else {
				$property = $key;
				$css     .= $prefix . "$property: $value;\n";
			}
		}

		return $css;
	}


	/**
	 * Script to append the correct sizing class to a block skeleton.
	 *
	 * @return string
	 */
	protected function get_skeleton_inline_script() {
		return "<script>
			var containers = document.querySelectorAll( 'div.wc-block-skeleton' );

			if ( containers.length ) {
				Array.prototype.forEach.call( containers, function( el, i ) {
					var w = el.offsetWidth;
					var classname = '';

					if ( w > 700 )
						classname = 'is-large';
					else if ( w > 520 )
						classname = 'is-medium';
					else if ( w > 400 )
						classname = 'is-small';
					else
						classname = 'is-mobile';

					if ( ! el.classList.contains( classname ) )  {
						el.classList.add( classname );
					}

					el.classList.remove( 'hidden' );
				} );
			}
		</script>";
	}
}
