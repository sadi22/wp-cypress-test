<?php

/**
 * Class Test_WC_Controller
 *
 * @package mrm
 */

/**
 * Test cases for the functions of the production
 * class Rex_Product_Data_Retriever.
 *
 * @see ./app/Internal/Frontend/WooCommerceCheckoutContact.php
 */
class Test_WC_Checkout_Contact extends WP_UnitTestCase {
	private static $instance;

	/**
	 * @desc Setup initial dependencies
	 * @return void
	 * @since 1.0.0
	 */
	public function setUp(): void {
		self::$instance = \Mint\MRM\Internal\Frontend\WooCommerceCheckoutContact::get_instance();
	}

	/**
	 * @desc Test cases for WooCommerceCheckoutContact::() function
	 * @return void
	 * @test
	 * @since 1.0.0
	 */
	public function register_user_as_contact() {
		$class_exists = is_object( self::$instance ) && 'Mint\MRM\Internal\Frontend\WooCommerceCheckoutContact' === get_class( self::$instance );
		$this->assertTrue( $class_exists );

		if ( $class_exists ) {
			$method_exists = method_exists( self::$instance, 'register_user_as_contact' );
			$this->assertTrue( $method_exists );
		}
	}
}
