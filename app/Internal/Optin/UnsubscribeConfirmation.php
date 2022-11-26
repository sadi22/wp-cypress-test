<?php
/**
 * Handles unsubscription process
 *
 * @author   MRM Team
 * @category API
 * @package  MRM
 * @since    1.0.0
 */

namespace Mint\MRM\Internal\Optin;

use Mint\MRM\DataBase\Models\ContactModel;
use MRM\Common\MRM_Common;

/**
 * UnsubscribeConfirmation class.
 *
 * @since 1.1.0
 */
class UnsubscribeConfirmation {


	/**
	 * Class instance.
	 *
	 * @var UnsubscribeConfirmation instance
	 */
	protected static $instance = null;

	/**
	 * Get class instance.
	 */
	public static function get_instance() {
		if ( ! self::$instance ) {
			self::$instance = new self();
		}
		return self::$instance;
	}


	/**
	 * OptinConfirmation constructor.
	 *
	 * @since 1.0.0
	 */
	public function __construct() {
		add_action( 'init', array( $this, 'unsubscribe_confirmation' ), 9999 );
	}


	/**
	 * Unsubscribe confirmation by the contact
	 *
	 * @return void
	 * @since 1.0.0
	 */
	public function unsubscribe_confirmation() {
		$get = MRM_Common::get_sanitized_get_post();
		$get = isset( $get['get'] ) ? $get['get'] : array();
		if ( isset( $get['mrm'] ) && isset( $get['route'] ) && 'unsubscribe' === $get['route'] ) {
			$contact_id = isset( $get['contact_id'] ) ? $get['contact_id'] : '';
			$hash       = isset( $get['hash'] ) ? $get['hash'] : '';
			$contact    = ContactModel::get( $contact_id );
			$mask_email = MRM_Common::obfuscate_email( $contact['email'] );
			require_once MRM_DIR_PATH . 'app/Resources/public/unsubscribe.php';
			die();
		}
	}


}
