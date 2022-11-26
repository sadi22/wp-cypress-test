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

use Mint\MRM\DataBase\Models\FormModel;
/**
 * [MRMForm_MRMSubscribeForm].
 *
 * @desc Manages Subscribe form  Block in mrm
 * @package /app/Internal/Ajax
 * @since 1.0.0
 */
class MRMFormMRMSubscribeForm extends GetMRMAbstractBlock {

	/**
	 * Default data.
	 *
	 * @var string
	 */
	protected $defaults = array();

	/**
	 * Block name.
	 *
	 * @var string
	 */
	protected $block_name = 'mrm-subscribe-form';

	/**
	 * Call  Construct function
	 * Call ajax Hook for visiable form
	 *
	 * @param string $block_name Get block name .
	 */
	public function __construct( $block_name = '' ) {
		parent::__construct( $block_name );
		add_action( 'wp_ajax_show_form_markup', array( $this, 'show_form_markup' ) );
	}
	/**
	 * Show Form Markup for mrm contact
	 *
	 * @return void
	 */
	public function show_form_markup() {
		if ( isset( $_POST['post_id'] ) && ! empty( $_POST['post_id'] ) ) { //phpcs:ignore
			$form_id = wp_unslash( $_POST['post_id'] ); //phpcs:ignore

			$get_form_data_by_id = FormModel::get( $form_id );
			$form_status         = isset( $get_form_data_by_id['status'] ) ? $get_form_data_by_id['status'] : 0;
			if ( ! $form_status ) {
				echo esc_html( 'This form is not active. Please check' );
				die();
			}
			ob_start();
			$output  = '';
			$output .= $get_form_data_by_id['form_body'];
			$output .= ob_get_clean();
			echo $output; //phpcs:ignore
			die();
		}
		echo esc_html( 'Please Select a Form ' );
		die();
	}
	/**
	 * Render the Featured Product block.
	 *
	 * @param array  $attributes Block attributes.
	 * @param string $content    Block content.
	 * @return string Rendered block type output.
	 */
	protected function render( $attributes, $content ) {
		$attributes  = wp_parse_args( $attributes, $this->defaults );
		$dynamic_css = $this->generate_assets( $attributes );
		$new_content = "<style>$dynamic_css</style>" . $content;

		return $this->inject_html_data_attributes( $new_content, $attributes );
	}


	/**
	 * Get generated dynamic styles from $attributes
	 *
	 * @param string $attributes Get atttributes for css.
	 * @param object $post  Get post data.
	 * @return array|string
	 */
	protected function get_generated_dynamic_styles( $attributes, $post ) {
		$selectors = array();
		return $this->generate_css( $selectors );
	}


	/**
	 * Get the styles for the wrapper element (background image, color).
	 *
	 * @param array $attributes Block attributes. Default empty array.
	 * @return string
	 */
	public function get_styles( $attributes ) {
		$style = '';
		return $style;
	}


	/**
	 * Get class names for the block container.
	 *
	 * @param array $attributes Block attributes. Default empty array.
	 * @return string
	 */
	public function get_classes( $attributes ) {
		$classes = array( 'getwpf-block-' . $this->block_name );
		return implode( ' ', $classes );
	}


	/**
	 * Extra data passed through from server to client for block.
	 *
	 * @param array $attributes  get Attributes .
	 * Any attributes that currently are available from the block.
	 *                           Note, this will be empty in the editor context when the block is
	 *                           not in the post content on editor load.
	 */
	protected function enqueue_data( $attributes = array() ) { //phpcs:ignore
		parent::enqueue_data( $attributes );
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
			'handle'       => 'getwpf-pricing-block-frontend',
			'path'         => $this->get_block_asset_build_path( 'pricing-block-frontend' ),
			'dependencies' => array(),
		);
		return $key ? $script[ $key ] : $script;
	}
}
