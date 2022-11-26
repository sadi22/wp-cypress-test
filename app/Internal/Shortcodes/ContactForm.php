<?php
/**
 * Mail Mint
 *
 * @author [MRM Team]
 * @email [support@rextheme.com]
 * @create date 2022-08-09 11:03:17
 * @modify date 2022-08-09 11:03:17
 * @package /app/Internal/Shortcodes
 */

namespace Mint\MRM\Internal\ShortCode;

use Mint\MRM\DataBase\Models\FormModel;

/**
 * [Manages plugin's contact form shortcodes]
 *
 * @desc Manages plugin's contact form shortcodes
 * @package /app/Internal/Shortcodes
 * @since 1.0.0
 */
class ContactForm {

	/**
	 * Shortcode attributes
	 *
	 * @var array
	 * @since 1.0.0
	 */
	protected $attributes = array();


	/**
	 * Initializes class functionalities
	 *
	 * @param array $attributes Shortcode attributes.
	 * @since 1.0.0
	 */
	public function __construct( $attributes = array() ) {
		$this->attributes = $this->parse_attributes( $attributes );
	}


	/**
	 * Get shortcode attributes.
	 *
	 * @return array
	 * @since  1.0.0
	 */
	public function get_attributes() {
		return $this->attributes;
	}


	/**
	 * Parses shortcode attributes
	 *
	 * @param array $attributes Shortcode attributes.
	 *
	 * @return array
	 * @since 1.0.0
	 */
	protected function parse_attributes( $attributes ) {
		$attributes = shortcode_atts(
			array(
				'id'    => 0,
				'class' => '',
			),
			$attributes
		);

		return $attributes;
	}


	/**
	 * Get wrapper classes
	 *
	 * @return array
	 * @since 1.0.0
	 */
	protected function get_wrapper_classes() {
		return array();
	}


	/**
	 * Content of opt-in form
	 *
	 * @return string
	 * @since 1.0.0
	 */
	public function get_content() {
		$form_id = isset( $this->attributes[ 'id' ] ) ? $this->attributes[ 'id' ] : 0;
		if ( 0 === (int) $form_id ) {
			return __( 'No form added', 'mrm' );
		}
		$form_data   = FormModel::get( $form_id );
		$form_status = isset( $form_data[ 'status' ] ) ? $form_data[ 'status' ] : 0;
		if ( empty( $form_data ) ) {
			return __( 'Form ID is not valid', 'mrm' );
		} elseif ( 'draft' === $form_status ) {
			return __( 'This form is not active. Please check', 'mrm' );
		}
		$get_setting    = FormModel::get_meta( $form_id );
		$form_setting   = isset( $get_setting[ 'meta_fields' ][ 'settings' ] ) ? $get_setting[ 'meta_fields' ][ 'settings' ] : (object) array();
		$form_setting   = json_decode( $form_setting );
		$form_placement = ! empty( $form_setting->settings->form_layout->form_position ) ? $form_setting->settings->form_layout->form_position : '';
		$form_animation = '';
		if ( 'default' !== $form_placement ) {
			$form_animation = ! empty( $form_setting->settings->form_layout->form_animation ) ? $form_setting->settings->form_layout->form_animation : '';
		}

		$form_close_button_color     = ! empty( $form_setting->settings->form_layout->close_button_color ) ? $form_setting->settings->form_layout->close_button_color : '#fff';
		$form_close_background_color = ! empty( $form_setting->settings->form_layout->close_background_color ) ? $form_setting->settings->form_layout->close_background_color : '#000';

		$blocks  = parse_blocks( $form_data[ 'form_body' ] );
		$output  = '';
		$cookies = isset( $_COOKIE[ 'mrm_form_dismissed' ] ) ? sanitize_text_field( wp_unslash( $_COOKIE[ 'mrm_form_dismissed' ] ) ) : '';
		$cookies = json_decode( stripslashes( $cookies ) );

		$show = true;
		if ( ! empty( $cookies->expire ) ) {
			$expire = $cookies->expire;

			$today = strtotime( 'today UTC' );

			if ( $today < $expire ) {
				$show = false;
			}
		}

		$block_html = '';
		$class      = '';
		foreach ( $blocks as $block ) {
			if ( 'core/columns' === $block[ 'blockName' ] ) {
				if ( isset( $block[ 'attrs' ][ 'style' ][ 'color' ][ 'background' ] ) ) {
					$class = 'custom-background';
				}
				if ( isset( $block[ 'attrs' ][ 'backgroundColor' ] ) ) {
					$class = 'custom-background';
				}
			}
			if ( 'core/group' === $block[ 'blockName' ] ) {
				if ( isset( $block[ 'attrs' ][ 'style' ][ 'color' ][ 'background' ] ) ) {
					$class = 'custom-background';
				}
				if ( isset( $block[ 'attrs' ][ 'backgroundColor' ] ) ) {
					$class = 'custom-background';
				}
			}
			if ( 'core/cover' === $block[ 'blockName' ] ) {
				if ( isset( $block[ 'attrs' ][ 'customOverlayColor' ] ) ) {
					$class = 'custom-background';
				}
				if ( isset( $block[ 'attrs' ][ 'url' ] ) ) {
					$class = 'custom-background';
				}
				if ( isset( $block[ 'attrs' ][ 'overlayColor' ] ) ) {
					$class = 'custom-background';
				}
			}

			$block_html .= render_block( $block );
		}
		if ( $show ) {
			ob_start(); ?>
			<div class="mintmrm">
				<div id="mrm-
				<?php
				echo esc_attr( $form_placement );
				?>
				" class="mrm-form-wrapper mrm-
				<?php
				echo esc_attr( $form_animation );

				echo isset( $this->attributes[ 'class' ] ) ? esc_attr( $this->attributes[ 'class' ] ) : '';
				echo 'mrm-' . esc_attr( $form_placement );
				?>
				">
					<div class="mrm-form-wrapper-inner
					<?php
					echo esc_attr( $class );
					?>
					">

						<?php
						if ( 'default' !== $form_placement ) {
							?>
							<span style="background:
							<?php
							echo esc_attr( $form_close_background_color );
							?>
							" class="mrm-form-close">
							<svg width="10" height="11" fill="none" viewBox="0 0 14 13" xmlns="http://www.w3.org/2000/svg"><path stroke="
								<?php
								echo esc_attr( $form_close_button_color );
								?>
								" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12.5 1l-11 11m0-11l11 11"/></svg>
							</span>
							<?php
						}
						?>

						<div class="mrm-form-overflow">
							<form method="post" id="mrm-form">
								<input hidden name="form_id" value="
								<?php
								echo isset( $form_data[ 'id' ] ) ? esc_attr( $form_data[ 'id' ] ) : 0;
								?>
								"/>
								<?php
								echo $block_html; //phpcs:ignore
								?>
							</form>

							<div class="response"></div>
						</div>

					</div>
				</div>

			</div>
			<?php
			$output .= ob_get_clean();

			return $output;
		}
	}
}
