<?php
/**
 * Mail Mint
 *
 * @author [MRM Team]
 * @email [support@rextheme.com]
 * @create date 2022-08-09 11:03:17
 * @modify date 2022-08-09 11:03:17
 * @package /app/Internal/FomrBuilder
 */

namespace Mint\MRM\Internal\FormBuilder;

use MRM\Common\MRM_Common;
use WP_REST_Request;
/**
 * MRM Form Builder Helper class.
 *
 * @since 1.0.0
 * @internal
 */
class FormBuilderHelper {
	/**
	 * Call construct
	 * Call All class for form builder
	 *
	 * @since 5.0.0
	 * @internal
	 */
	public function __construct() {
		new GetMRMBlockManager();
		new MRMSubscribeForm();
		add_action( 'admin_enqueue_scripts', array( $this, 'mrm_block_editor_init' ) );
	}
	/**
	 * Run For builder in specified page
	 *
	 * @param string $hook get Cusrrent page .
	 * @return void
	 */
	public function mrm_block_editor_init( $hook ) {
		global $current_screen;

		if ( 'toplevel_page_mrm-admin' !== $hook ) {
			return;
		}

		$current_screen->is_block_editor( true );

		$script_handle     = 'mrm-form-builder-scripts';
		$script_path       = 'build/index.js';
		$script_asset_path = dirname( __FILE__ ) . '/build/index.asset.php';

		$script_asset = file_exists( $script_asset_path ) ? require $script_asset_path : array('dependencies' => array() ); //phpcs:ignore
		$script_url   = plugins_url( $script_path, __FILE__ );
		$version      = isset( $script_asset['version'] ) ? $script_asset['version'] : '';
		wp_enqueue_script( $script_handle, $script_url, $script_asset['dependencies'], $version ); //phpcs:ignore

		$settings = $this->get_block_editor_settings();
		wp_add_inline_script( $script_handle, 'window.getmrmsetting = ' . wp_json_encode( $settings ) . ';' );

		wp_add_inline_script(
			'wp-blocks',
			'wp.blocks.unstable__bootstrapServerSideBlockDefinitions(' . wp_json_encode( get_block_editor_server_block_settings() ) . ');'
		);

		wp_enqueue_script( 'wp-format-library' );
		wp_enqueue_style( 'wp-format-library' );

		wp_enqueue_style('mrm-form-builder-styles', //phpcs:ignore
			plugins_url( 'build/index.css', __FILE__ ), //phpcs:ignore
			array( 'wp-edit-blocks' ) //phpcs:ignore
		);
	}

	/**
	 * Get Block editor Setting
	 */
	public function get_block_editor_settings() {
		$theme_color               = $this->get_palette_theme_color();
		$allowed_blocks_for_editor = array(
			'core/paragraph',
			'core/heading',
			'core/image',
			'core/columns',
			'core/html',
			'core/spacer',
			'core/subhead',
			'core/group',
			'core/column',
			'core/cover',
			'mrmformfield/email-field-block',
			'mrmformfield/first-name-block',
			'mrmformfield/last-name-block',
			'mrmformfield/mrm-button-block',
			'mrmformfield/mrm-custom-field',
		);

		$allowed_blocks = apply_filters( 'mrm_add_form_builder_blocks_support', $allowed_blocks_for_editor );

		$settings      = array(
			'disableCustomColors'         => get_theme_support( 'disable-custom-colors' ),
			'disableCustomFontSizes'      => get_theme_support( 'disable-custom-font-sizes' ),
			'allowedBlockTypes'           => $allowed_blocks,
			'isRTL'                       => is_rtl(),
			'__experimentalBlockPatterns' => array(),
			'__experimentalFeatures'      => array(
				'appearanceTools' => true,
				'border'          => array(
					'color'  => false,
					'radius' => true,
					'style'  => true,
					'width'  => false,
				),
				'color'           => array(
					'background'       => true,
					'customDuotone'    => false,
					'defaultGradients' => false,
					'defaultPalette'   => false,
					'duotone'          => array(),
					'gradients'        => array(),
					'link'             => false,
					'palette'          => array(
						'theme' => $theme_color['colors'],
					),
					'text'             => true,
				),
				'spacing'         => array(
					'blockGap' => null,
					'margin'   => true,
				),
				'typography'      => array(
					'dropCap'        => false,
					'fontStyle'      => true,
					'fontWeight'     => true,
					'letterSpacing'  => true,
					'textDecoration' => true,
					'textTransform'  => true,
					'fontSize'       => true,
				),
			),
			'disableCustomGradients'      => true,
			'enableCustomLineHeight'      => get_theme_support( 'custom-line-height' ),
			'enableCustomSpacing'         => get_theme_support( 'custom-spacing' ),
			'enableCustomUnits'           => false,
			'keepCaretInsideBlock'        => true,
		);
		$color_palette = current( (array) get_theme_support( 'editor-color-palette' ) );
		if ( false !== $color_palette ) {
			$settings['colors'] = $color_palette;
		} else {
			$settings['colors'] = array();
		}

		if ( $theme_color['font_sizes'] ) {
			$settings['fontSizes'] = $theme_color['font_sizes'];
		} else {
			$settings['fontSizes'] = array();
		}

		return $settings;
	}

	/**
	 * Get Block editor Setting
	 */
	public static function get_palette_theme_color() {
		static $color;
		if ( ! $color ) {
			list($color_palette) = get_theme_support( 'editor-color-palette' );

			if ( empty( $color_palette ) || ! is_array( $color_palette ) || count( $color_palette ) < 2 ) {
				$color_palette = array(
					array(
						'name'  => __( 'Black', 'mrm' ),
						'slug'  => 'black',
						'color' => '#000000',
					),
					array(
						'name'  => __( 'Cyan bluish gray', 'mrm' ),
						'slug'  => 'cyan-bluish-gray',
						'color' => '#abb8c3',
					),
					array(
						'name'  => __( 'White', 'mrm' ),
						'slug'  => 'white',
						'color' => '#ffffff',
					),
					array(
						'name'  => __( 'Pale pink', 'mrm' ),
						'slug'  => 'pale-pink',
						'color' => '#f78da7',
					),
					array(
						'name'  => __( 'Luminous vivid orange', 'mrm' ),
						'slug'  => 'luminous-vivid-orange',
						'color' => '#ff6900',
					),
					array(
						'name'  => __( 'Luminous vivid amber', 'mrm' ),
						'slug'  => 'luminous-vivid-amber',
						'color' => '#fcb900',
					),
					array(
						'name'  => __( 'Light green cyan', 'mrm' ),
						'slug'  => 'light-green-cyan',
						'color' => '#7bdcb5',
					),
					array(
						'name'  => __( 'Vivid green cyan', 'mrm' ),
						'slug'  => 'vivid-green-cyan',
						'color' => '#00d084',
					),
					array(
						'name'  => __( 'Pale cyan blue', 'mrm' ),
						'slug'  => 'pale-cyan-blue',
						'color' => '#8ed1fc',
					),
					array(
						'name'  => __( 'Vivid cyan blue', 'mrm' ),
						'slug'  => 'vivid-cyan-blue',
						'color' => '#0693e3',
					),
					array(
						'name'  => __( 'Vivid purple', 'mrm' ),
						'slug'  => 'vivid-purple',
						'color' => '#9b51e0',
					),
				);
			}

			list($font_sizes) = (array) get_theme_support( 'editor-font-sizes' );

			if ( empty( $font_sizes ) ) {
				$font_sizes = array(
					array(
						'name'      => __( 'Small', 'mrm' ),
						'shortName' => 'S',
						'size'      => 14,
						'slug'      => 'small',
					),
					array(
						'name'      => __( 'Medium', 'mrm' ),
						'shortName' => 'M',
						'size'      => 18,
						'slug'      => 'medium',
					),
					array(
						'name'      => __( 'Large', 'mrm' ),
						'shortName' => 'L',
						'size'      => 24,
						'slug'      => 'large',
					),
					array(
						'name'      => __( 'Larger', 'mrm' ),
						'shortName' => 'XL',
						'size'      => 32,
						'slug'      => 'larger',
					),
				);
			}

			$color = apply_filters(
				'mrm_theme_plate_color',
				array(
					'colors'     => (array) $color_palette,
					'font_sizes' => (array) $font_sizes,
				)
			);
		}

		return $color;
	}



}
