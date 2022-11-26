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

namespace Mint\MRM\Internal\Admin;

use Mint\Mrm\Internal\Traits\Singleton;

/**
 * [Manage WooCommerce order details]
 *
 * @desc Manage WooCommerce order details
 * @package /app/Internal/Admin
 * @since 1.0.0
 */
class WooCommerceOrderDetails {

	use Singleton;

	/**
	 * Initialize actions
	 *
	 * @return void
	 * @since 1.0.0
	 */
	public function init() {
		add_action(
			'woocommerce_admin_order_data_after_order_details',
			array(
				$this,
				'render_subscription_consent_message',
			)
		);
	}

	/**
	 * Add subscription consent message in order details page
	 *
	 * @param \WC_Order $order Order object of WooCommerce.
	 * @return void
	 * @since 1.0.0
	 */
	public function render_subscription_consent_message( \WC_Order $order ) {
		$consent_message = get_post_meta( $order->get_id(), '_mrm_newsletter_subscription', true );
		if ( $consent_message ) :
			?>
			<p class="form-field form-field-wide">
			<p class="order_note"><strong>
			<?php
					esc_html_e( 'Newsletter subscription:', 'mrm' );
			?>
					</strong> 
					<?php
					esc_html_e( $consent_message, 'mrm' ); //phpcs:ignore
					?>
				</p>
			</p>
			<?php
		endif;
	}
}
