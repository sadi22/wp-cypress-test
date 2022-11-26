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
 * [Manage pages of the plugin]
 *
 * @desc Manage pages of the plugin
 * @package /app/Internal/Admin
 * @since 1.0.0
 */
class PageController {

	use Singleton;

	/**
	 * [Initialize class functionalities]
	 *
	 * @desc Initialize class functionalities
	 * @since 1.0.0
	 */
	public function __construct() {
		// Init home screen.
		HomeScreen::get_instance();
	}
}
