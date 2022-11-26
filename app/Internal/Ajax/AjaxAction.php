<?php
/**
 * Mail Mint
 *
 * @author [MRM Team]
 * @email [support@rextheme.com]
 * @create date 2022-08-09 11:03:17
 * @modify date 2022-08-09 11:03:17
 * @package /app/Internal/Ajax
 */

namespace Mint\MRM\Internal\Ajax;

use Mint\MRM\Admin\API\Controllers\MessageController;
use Mint\MRM\Admin\API\Controllers\TagController;
use Mint\MRM\DataBase\Models\ContactModel;
use Mint\MRM\DataBase\Models\CustomFieldModel;
use Mint\MRM\DataBase\Models\FormModel;
use Mint\MRM\DataStores\ContactData;
use Mint\MRM\DataStores\CustomFieldData;
use Mint\Mrm\Internal\Traits\Singleton;
use MRM\Common\MRM_Common;

/**
 * [Manages Ajax submit in mrm form ]
 *
 * @desc Manages ajax submit in mrm
 * @package /app/Internal/Ajax
 * @since 1.0.0
 */
class AjaxAction {

	use Singleton;

	/**
	 * Call Class Constructor
	 * Call Wp ajax Hook
	 */
	private function __construct() {
		add_action( 'wp_ajax_mrm_submit_form', array( $this, 'mrm_submit_form' ) );
		add_action( 'wp_ajax_nopriv_mrm_submit_form', array( $this, 'mrm_submit_form' ) );
	}
	/**
	 * Form Submit by Ajax
	 *
	 * @return void
	 * @since 1.0.0
	 */
	public function mrm_submit_form() {
		check_ajax_referer( 'wp_mrm_submit_form', 'security' );
		$params   = $_POST;
		$response = array(
			'status'  => 'failed',
			'message' => 'Form is not valid',
		);
		if ( isset( $params['action'] ) && 'mrm_submit_form' === $params['action'] ) {
			$get_post_data = isset( $_POST['post_data'] ) ? wp_unslash( $_POST['post_data'] ) : ''; //phpcs:ignore
			parse_str( $get_post_data, $post_data );
			$form_data                = array();
			$form_data['meta_fields'] = array();
			if ( $post_data ) {
				foreach ( $post_data as $key => $value ) {
					if ( 'email' === $key ) {
						$form_data['email'] = $value;
					} elseif ( 'last_name' === $key ) {
						$form_data['last_name'] = $value;
					} elseif ( 'first_name' === $key ) {
						$form_data['first_name'] = $value;
					} elseif ( 'form_id' === $key ) {
						$form_data['form_id'] = $value;
					} else {
						$form_data['meta_fields'][ $key ] = $value;
					}
				}
			}
			$form_id    = isset( $form_data['form_id'] ) ? $form_data['form_id'] : 0;
			$form_email = isset( $form_data['email'] ) ? $form_data['email'] : '';
			if ( ! $form_email ) {
				$response['status']  = 'success';
				$response['message'] = __( 'Email Field Not found', 'mrm' );
				echo wp_json_encode( $response, true );
				die();
			}
			$parms       = array(
				'first_name' => isset( $form_data['first_name'] ) ? $form_data['first_name'] : '',
				'last_name'  => isset( $form_data['last_name'] ) ? $form_data['last_name'] : '',
			);
			$contact     = new ContactData( $form_email, $parms );
			$exist_email = ContactModel::is_contact_exist( $form_email );
			if ( $exist_email ) {
				$response['status']  = 'success';
				$response['message'] = __( 'Email address already assigned to another contact.', 'mrm' );
				echo wp_json_encode( $response, true );
				die();
			}
			do_action( 'mrm_before_form_submit', $contact );
			$contact_id = ContactModel::insert( $contact );
			if ( $contact_id ) {
				$cookie_time = apply_filters( 'mrm_set_form_cookies_time', get_option( '_mrm_form_dismissed', 7 ) );
				$today       = strtotime( 'today UTC' );
				$cookie_time = strtotime( '+' . $cookie_time . 'day', $today );

				$cookie_name  = 'mrm_form_dismissed';
				$cookie_value = (object) array(
					'show'   => 1,
					'expire' => $cookie_time,
				);
				if ( ! isset( $_COOKIE[ $cookie_name ] ) ) {
					setcookie( $cookie_name, wp_json_encode( $cookie_value ), $cookie_time, '/' );
				}
				do_action( 'mrm_after_form_submit', $contact_id, $contact );
				/**
				 * Send Double Optin Email
				 */
				MessageController::get_instance()->send_double_opt_in( $contact_id );

				$entries       = FormModel::get_form_meta_value_with_key( $form_id, 'entries' );
				$entries_count = isset( $entries['meta_fields']['entries'] ) ? $entries['meta_fields']['entries'] : 0;

				$args['meta_fields'] = array(
					'entries' => $entries_count + 1,
				);
				FormModel::update_meta_fields( $form_id, $args );

				/**
				 * Assign Tag and List for contact
				 */
				$get_group_id = FormModel::get( $form_id );
				$group_ids    = isset( $get_group_id['group_ids'] ) ? unserialize( $get_group_id['group_ids'] ) : array(); //phpcs:ignore
				$group_tag    = isset( $group_ids['tags'] ) ? $group_ids['tags'] : array();
				$group_list   = isset( $group_ids['lists'] ) ? $group_ids['lists'] : array();
				$group_data   = array_merge( $group_tag, $group_list );
				$ids          = array();
				foreach ( $group_data as $id ) {
					$ids[] = $id['id'];
				}
				TagController::set_tags_to_contact( $ids, $contact_id );
				$meta_fields['meta_fields'] = isset( $form_data['meta_fields'] ) ? $form_data['meta_fields'] : array();
				ContactModel::update_meta_fields( $contact_id, $meta_fields );

				/**
				 * After form submit
				 * get status and check this will done after submit form
				 */
				$get_setting       = FormModel::get_meta( $form_id );
				$form_setting      = isset( $get_setting['meta_fields']['settings'] ) ? $get_setting['meta_fields']['settings'] : array();
				$form_setting      = json_decode( $form_setting );
				$confirmation_type = $form_setting->settings->confirmation_type;
				if ( ! empty( $confirmation_type->same_page ) ) {
					$same_page                         = $confirmation_type->same_page;
					$response['confirmation_type']     = 'same_page';
					$response['after_form_submission'] = $same_page->after_form_submission;
					$response['message']               = $same_page->message_to_show;
				}if ( ! empty( $confirmation_type->to_a_page ) ) {
					$to_a_page                     = $confirmation_type->to_a_page;
					$response['confirmation_type'] = 'to_a_page';
					$response['redirect_page']     = get_permalink( $to_a_page->page );
					$response['message']           = $to_a_page->redirection_message;
				}
				if ( ! empty( $confirmation_type->to_a_custom_url ) ) {
					$to_a_custom_url               = $confirmation_type->to_a_custom_url;
					$response['confirmation_type'] = 'to_a_custom_url';
					$response['custom_url']        = $to_a_custom_url->custom_url;
					$response['message']           = $to_a_custom_url->custom_redirection_message;
				}
				$response['status'] = 'success';
				echo wp_json_encode( $response, true );
				die();
			}
		}
		echo wp_json_encode( $response, true );
		die();
	}

}
