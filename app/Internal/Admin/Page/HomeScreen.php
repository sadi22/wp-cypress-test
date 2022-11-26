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

namespace Mint\MRM\Internal\Admin\Page;

use Mint\Mrm\Internal\Traits\Singleton;

/**
 * [Register plugin menus]
 *
 * @desc Register plugin menus
 * @package /app/Internal/Admin
 * @since 1.0.0
 */
class HomeScreen {

	use Singleton;

	const MENU_SLUG = 'mrm-admin';

	/**
	 * [Initialize class functionalities]
	 *
	 * @desc Initialize class functionalities
	 * @since 1.0.0
	 */
	public function __construct() {
		add_action( 'admin_menu', array( $this, 'register_page' ) );
	}

	/**
	 * [Register menus]
	 *
	 * @desc Register menus
	 * @since 1.0.0
	 */
	public function register_page() {
		add_menu_page(
			__( 'MRM', 'mrm' ),
			__( 'MRM', 'mrm' ),
			'manage_options',
			self::MENU_SLUG,
			array( $this, 'load_wrapper' ),
			$this->get_menu_icon(),
			2
		);

		add_submenu_page(
			self::MENU_SLUG,
			__( 'Dashboard', 'mrm' ),
			__( 'Dashboard', 'mrm' ),
			'manage_options',
			self::MENU_SLUG,
			array( $this, 'load_wrapper' )
		);

		add_submenu_page(
			self::MENU_SLUG,
			__( 'Contacts', 'mrm' ),
			__( 'Contacts', 'mrm' ),
			'manage_options',
			'mrm-admin#/contacts/',
			array( $this, 'load_wrapper' )
		);
		add_submenu_page(
			self::MENU_SLUG,
			__( 'Campaigns', 'mrm' ),
			__( 'Campaigns', 'mrm' ),
			'manage_options',
			'mrm-admin#/campaigns/',
			array(
				$this,
				'load_wrapper',
			)
		);
		add_submenu_page(
			self::MENU_SLUG,
			__( 'Forms', 'mrm' ),
			__( 'Forms', 'mrm' ),
			'manage_options',
			'mrm-admin#/forms/',
			array(
				$this,
				'load_wrapper',
			)
		);
		add_submenu_page(
			self::MENU_SLUG,
			__( 'Settings', 'mrm' ),
			__( 'Settings', 'mrm' ),
			'manage_options',
			'mrm-admin#/settings/business-info/',
			array(
				$this,
				'load_wrapper',
			)
		);
	}

	/**
	 * [Loads plugin default wrapper]
	 *
	 * @desc Loads plugin default wrapper
	 * @return void
	 * @since 1.0.0
	 */
	public function load_wrapper() {
		?>
		<div class="crm-app-wrapper" style="display: block; ">
			<div id="crm-app"></div>
			<div id="crm-portal"></div>
		</div>
		<?php
	}

	/**
	 * Gets the SVG icon for menu
	 *
	 * @desc Gets the SVG icon for menu
	 * @return string
	 * @since 1.0.0
	 */
	private function get_menu_icon() {
		return 'data:image/svg+xml;base64,' . base64_encode(        //phpcs:ignore
			'<?xml version="1.0" standalone="no"?>
        <!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 20010904//EN"
         "http://www.w3.org/TR/2001/REC-SVG-20010904/DTD/svg10.dtd">
        <svg version="1.0" xmlns="http://www.w3.org/2000/svg"
         width="32.000000pt" height="32.000000pt" viewBox="0 0 32.000000 32.000000"
         preserveAspectRatio="xMidYMid meet">
        
        <g transform="translate(0.000000,32.000000) scale(0.100000,-0.100000)"
        fill="#000000" stroke="none">
        <path d="M24 285 c-9 -23 3 -45 24 -45 10 0 23 -5 30 -12 16 -16 25 -4 13 19
        -5 10 -12 26 -15 36 -7 21 -44 23 -52 2z"/>
        <path d="M244 283 c-3 -10 -10 -26 -15 -36 -13 -24 -6 -31 18 -18 10 5 26 12
        36 15 12 4 17 14 15 28 -4 29 -45 38 -54 11z"/>
        <path d="M116 191 c-31 -32 -32 -66 -1 -66 16 0 20 7 20 35 0 31 3 35 25 35
        22 0 25 -4 25 -37 0 -24 -5 -38 -12 -38 -7 0 -13 -4 -13 -10 0 -17 36 -11 53
        8 23 26 21 41 -10 74 -34 35 -52 35 -87 -1z"/>
        <path d="M70 90 c-8 -5 -23 -11 -33 -14 -12 -4 -17 -14 -15 -28 4 -29 45 -38
        54 -11 3 10 10 26 15 35 15 30 9 35 -21 18z"/>
        <path d="M220 95 c0 -3 4 -13 9 -23 5 -9 12 -25 15 -35 9 -27 50 -18 54 11 2
        14 -3 24 -15 28 -10 3 -26 10 -35 15 -20 10 -28 11 -28 4z"/>
        </g>
        </svg>'
		);
	}

}
