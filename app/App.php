<?php
/**
 * App Class for Create Instance
 *
 * @author [MRM Team]
 * @email [support@rextheme.com]
 * @create date 2022-08-09 11:03:17
 * @modify date 2022-08-09 11:03:17
 * @package /app
 */

namespace Mint\MRM;

use Mint\MRM\Admin\API\Server;
use Mint\MRM\Internal\Admin\AdminAssets;
use Mint\MRM\Internal\Admin\FrontendAssets;
use Mint\MRM\Internal\Admin\Page\PageController;
use Mint\MRM\Internal\Admin\UserAssignContact;
use Mint\MRM\Internal\Ajax\AjaxAction;
use Mint\MRM\Internal\FormBuilder\FormBuilderHelper;
use Mint\MRM\Internal\FormBuilder\GetMRM_Block_Manager;
use Mint\MRM\Internal\Frontend\WooCommerceCheckoutContact;
use Mint\MRM\Internal\Optin\OptinConfirmation;
use Mint\MRM\Internal\ShortCode\ShortCode;
use Mint\Mrm\Internal\Traits\Singleton;
use Mint\MRM\Internal\Cron\CampaignsBackgroundProcess;
use Mint\MRM\Internal\Optin\UnsubscribeConfirmation;
use Mint\MRM\Internal\Admin\WooCommerceOrderDetails;
/**
 * MRM App class.
 *
 * @since 1.0.0
 */
class App {

	use Singleton;

	/**
	 * Init the plugin
	 *
	 * @since 1.0.0
	 */
	public function init() {
		if ( did_action( 'plugins_loaded' ) ) {
			self::on_plugins_loaded();
		} else {
			add_action( 'plugins_loaded', array( $this, 'on_plugins_loaded' ), 9 );
		}

		if ( $this->is_request( 'admin' ) ) {
			// Load assets.
			AdminAssets::get_instance();
		}
		// init form-builder.
		new FormBuilderHelper();

		// init plugin shortcodes.
		ShortCode::get_instance()->init();

		// init ajax.
		AjaxAction::get_instance();

		if ( $this->is_request( 'frontend' ) ) {

			// User assign contact form user in Sign up and comment.
			UserAssignContact::get_instance();
			// Load assets.
			FrontendAssets::get_instance();
			// Opt-in.
			OptinConfirmation::get_instance();
			// Unsubscription.
			UnsubscribeConfirmation::get_instance();

			WooCommerceCheckoutContact::get_instance()->init();
		}

		CampaignsBackgroundProcess::get_instance()->init();

		WooCommerceOrderDetails::get_instance()->init();
	}

	/**
	 * Loaded hook after plugin loaded
	 *
	 * @since 1.0.0
	 */
	public function on_plugins_loaded() {
		$this->includes();
	}


	/**
	 * Include required classes
	 *
	 * @since 1.0.0
	 */
	private function includes() {

		// Initialize API.
		Server::get_instance();

		if ( $this->is_request( 'admin' ) ) {

			// Initialize Page.
			PageController::get_instance();
		}
	}


	/**
	 * Check the type of the request
	 *
	 * @param string $type get request type .
	 * @return bool
	 * @since 1.0.0
	 */
	private function is_request( $type ) {
		switch ( $type ) {
			case 'admin':
				return is_admin();
			case 'ajax':
				return defined( 'DOING_AJAX' );
			case 'cron':
				return defined( 'DOING_CRON' );
			case 'frontend':
				return ( ! is_admin() || defined( 'DOING_AJAX' ) ) && ! defined( 'DOING_CRON' );
		}
	}

}
