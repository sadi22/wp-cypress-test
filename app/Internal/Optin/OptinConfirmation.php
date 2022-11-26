<?php
/**
 * Handles double opt-in subscription process
 *
 * @author   MRM Team
 * @category API
 * @package  MRM
 * @since    1.0.0
 */

namespace Mint\MRM\Internal\Optin;

use Mint\MRM\DataBase\Models\ContactModel;
use Mint\MRM\DataBase\Models\NoteModel;
use Mint\MRM\DataStores\NoteData;
use MRM\Common\MRM_Common;

/**
 * OptinConfirmation class.
 *
 * @since 1.1.0
 */
class OptinConfirmation {

	/**
	 * Class instance.
	 *
	 * @var OptinConfirmation instance
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
		add_action( 'init', array( $this, 'double_optin_confirmation' ), 9999 );
	}


	/**
	 * Double optin confirmation by the contact
	 *
	 * @return void
	 * @since 1.0.0
	 */
	public function double_optin_confirmation() {
		$get = MRM_Common::get_sanitized_get_post();
		$get = isset( $get['get'] ) ? $get['get'] : array();

		if ( isset( $get['mrm'] ) && isset( $get['route'] ) && 'confirmation' === $get['route'] ) {
			$default = array(
				'enable'               => true,
				'email_subject'        => 'Please Confirm Subscription.',
				'email_body'           => 'Please Confirm Subscription. {{subscribe_link}}. <br> If you receive this email by mistake, simply delete it.',
				'confirmation_type'    => 'message',
				'confirmation_message' => 'Subscription Confirmed. Thank you.',
			);

			$settings          = get_option( '_mrm_optin_settings', $default );
			$confirmation_type = isset( $settings['confirmation_type'] ) ? $settings['confirmation_type'] : '';

			// Get contact information by unique hash.
			$hash       = isset( $get['hash'] ) ? $get['hash'] : '';
			$contact    = ContactModel::get_by_hash( $hash );
			$contact_id = isset( $contact['id'] ) ? $contact['id'] : '';

			if ( $hash === $contact['hash'] ) {
				$args = array(
					'contact_id' => $contact_id,
					'status'     => 'subscribed',
				);

				// Update contact status from pending to subscribed.
				ContactModel::update( $args, $contact_id );

				// Create a note for the contact subscription.
				$notes = array(
					'title'       => __( 'Subscriber double opt-in confirmed', 'mrm' ),
					'description' => __( 'Subscriber confirmed double opt-in', 'mrm' ),
					'type'        => 'MRM Note',
					'is_public'   => 1,
					'status'      => 1,
					'created_by'  => 1,
				);

				$note = new NoteData( $notes );

				NoteModel::insert( $note, $contact_id );
			}

			if ( 'message' === $confirmation_type ) {
				$confirmation_message = isset( $settings['confirmation_message'] ) ? $settings['confirmation_message'] : '';
				require_once MRM_DIR_PATH . 'app/Resources/public/confirmation.php';
			} elseif ( 'redirect' === $confirmation_type ) {
				$url = isset( $settings['url'] ) ? $settings['url'] : '';
				wp_safe_redirect( $url );
			} else {
				$page_id = isset( $settings['page_id'] ) ? $settings['page_id'] : '';
				wp_safe_redirect( get_permalink( $page_id ) );
			}
			die();
		}
	}
}
