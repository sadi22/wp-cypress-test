<?php
/**
 * Mail Mint
 *
 * @author [MRM Team]
 * @email [support@rextheme.com]
 * @create date 2022-08-09 11:03:17
 * @modify date 2022-08-09 11:03:17
 * @package /app/Internal/Frontend
 */

namespace Mint\MRM\Internal\Frontend;

use Mint\MRM\Admin\API\Controllers\ListController;
use Mint\MRM\Admin\API\Controllers\MessageController;
use Mint\MRM\Admin\API\Controllers\TagController;
use Mint\MRM\DataBase\Models\ContactModel;
use Mint\MRM\DataStores\ContactData;
use Mint\Mrm\Internal\Traits\Singleton;

/**
 * [Manages assigning WC user in mrm contact from WC checkout]
 *
 * @desc Manages assigning WC user in mrm contact from WC checkout
 * @package /app/Internal/Frontend
 * @since 1.0.0
 */
class WooCommerceCheckoutContact {

	use Singleton;

	/**
	 * WooCommerce settings from wp_options table
	 *
	 * @var array
	 * @since 1.0.0
	 */
	protected $setting_options;

	/**
	 * Initialize actions
	 *
	 * @return void
	 * @since 1.0.0
	 */
	public function init() {
		$this->setting_options = get_option( '_mrm_woocommerce_settings', array() );
		$checkbox_enabled      = isset( $this->setting_options[ 'enable' ] ) ? $this->setting_options[ 'enable' ] : false;
		if ( $checkbox_enabled ) {
			add_action( 'woocommerce_checkout_after_terms_and_conditions', array( $this, 'add_consent_checkbox' ) );
			add_action( 'woocommerce_checkout_process', array( $this, 'register_user_as_contact' ) );
		}
	}

	/**
	 * Add consent checkbox to add contact after checkout [before checkout button]
	 *
	 * @return void
	 * @since 1.0.0
	 */
	public function add_consent_checkbox() {
		$label      = isset( $this->setting_options[ 'checkbox_label' ] ) ? $this->setting_options[ 'checkbox_label' ] : 'Register me as a contact after checkout.';
		$user_email = is_user_logged_in() ? wp_get_current_user()->user_email : false;

		if ( $user_email && ! ContactModel::is_contact_exist( $user_email ) || ! is_user_logged_in() ) :
			?>
			<div class="mintmrm-add-contact-consent-content">
				<input type="checkbox" id="mintmrm_add_contact_consent_checkbox" name="mintmrm_add_contact_consent_checkbox">
				<label for="mintmrm_add_contact_consent_checkbox">
					<?php
					esc_html_e( $label, 'mrm' ); //phpcs:ignore
					?>
				</label>
			</div>
			<?php
		endif;
	}

	/**
	 * Register current user as Mint MRM contact
	 *
	 * @return void
	 * @since 1.0.0
	 */
	public function register_user_as_contact() {
		$consent_accepted = WC()->checkout()->get_value( 'mintmrm_add_contact_consent_checkbox' );

		if ( $consent_accepted ) {
			$user_email = is_user_logged_in() ? wp_get_current_user()->user_email : false;
			$wc_user_id = $user_email ? wp_get_current_user()->ID : false;
			$user_email = $user_email ?: WC()->checkout()->get_value( 'billing_email' );

			if ( $user_email && ! ContactModel::is_contact_exist( $user_email ) ) {
				$user_first_name     = WC()->checkout()->get_value( 'billing_first_name' );
				$user_last_name      = WC()->checkout()->get_value( 'billing_last_name' );
				$double_optin        = get_option( '_mrm_optin_settings', array() );
				$double_optin        = isset( $double_optin[ 'enable' ] ) && $double_optin[ 'enable' ];
				$subscription_status = $double_optin ? 'pending' : 'subscribed';

				$setting_tags  = isset( $this->setting_options[ 'tags' ] ) ? $this->setting_options[ 'tags' ] : array();
				$setting_lists = isset( $this->setting_options[ 'lists' ] ) ? $this->setting_options[ 'lists' ] : array();

				$user_data = array(
					'email'      => $user_email,
					'first_name' => $user_first_name,
					'last_name'  => $user_last_name,
					'status'     => array( $subscription_status ),
					'lists'      => $setting_lists,
					'tags'       => $setting_tags,
				);

				$contact    = new ContactData( $user_email, $user_data );
				$contact_id = ContactModel::insert( $contact );

				if ( ! empty( $setting_tags ) ) {
					TagController::set_tags_to_contact( $setting_tags, $contact_id );
				}

				if ( ! empty( $setting_lists ) ) {
					ListController::set_lists_to_contact( $setting_lists, $contact_id );
				}

				$meta_data[ 'meta_fields' ] = array(
					'_mrm_wc_customer_id' => $wc_user_id,
				);
				ContactModel::update_meta_fields( $contact_id, $meta_data );

				if ( $double_optin && $contact_id ) {
					MessageController::get_instance()->send_double_opt_in( $contact_id );
				}
				add_action( 'woocommerce_checkout_create_order', array( $this, 'add_consent_to_order_meta' ) );
			}
		}
	}

	/**
	 * Add subscription consent message in order meta
	 *
	 * @param \WC_Order $order WooCommerce order object.
	 *
	 * @return void
	 * @since 1.0.0
	 */
	public function add_consent_to_order_meta( $order ) {
		$consent_accepted = WC()->checkout()->get_value( 'mintmrm_add_contact_consent_checkbox' );

		if ( $consent_accepted ) {
			$order->update_meta_data( '_mrm_newsletter_subscription', isset( $this->setting_options[ 'checkbox_label' ] ) ? $this->setting_options[ 'checkbox_label' ] : '' );
		}
	}
}
