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

use Mint\Mrm\Internal\Traits\Singleton;

/**
 * [Manages plugin's shortcodes]
 *
 * @desc Manages plugin's shortcodes
 * @package /app/Internal/Shortcodes
 * @since 1.0.0
 */
class ShortCode {

	use Singleton;

	/**
	 * Initializes class functionalities and register shortcodes
	 *
	 * @since 1.0.0
	 */
	public static function init() {
		$shortcodes = array(
			'mintmrm' => __CLASS__ . '::render_contact_form',
		);

		foreach ( $shortcodes as $shortcode => $function ) {
			add_shortcode( $shortcode, $function );
		}
	}


	/**
	 * Renders Shortcode
	 *
	 * @param array|object $atts Form attributes.
	 *
	 * @return string
	 * @since 1.0.0
	 */
	public static function render_contact_form( $atts ) {
		$shortcode = new ContactForm( (array) $atts );

		return $shortcode->get_content();
	}
}
