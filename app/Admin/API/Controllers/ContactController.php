<?php
/**
 * REST API Contact Controller
 *
 * Handles requests to the contacts endpoint.
 *
 * @author   MRM Team
 * @category API
 * @package  MRM
 * @since    1.0.0
 */

namespace Mint\MRM\Admin\API\Controllers;

use Mint\MRM\DataBase\Models\ContactModel;
use Mint\Mrm\Internal\Traits\Singleton;
use WP_REST_Request;
use Exception;
use Mint\MRM\DataStores\ContactData;
use MRM\Common\MRM_Common;
use MRM\Helpers\Importer\MRM_Importer;
use Mint\MRM\Constants;
use MailchimpMarketing;
use Mint\MRM\DataBase\Models\ContactGroupModel;
use Mint\MRM\DataBase\Models\CustomFieldModel;
use Mint\MRM\Internal\Constants as InternalConstants;
use Mint\MRM\DataBase\Models\MessageModel;

/**
 * This is the main class that controls the contacts feature. Its responsibilities are:
 *
 * - Create or update a contact
 * - Delete single or multiple contacts
 * - Retrieve single or multiple contacts
 * - Assign or removes tags and lists from the contact
 *
 * @package Mint\MRM\Admin\API\Controllers
 */
class ContactController extends BaseController {

	use Singleton;


	/**
	 * CSV data override to this file
	 *
	 * @var string
	 * @since 1.0.0
	 */
	private $import_file_location;

	/**
	 * Export data override to this file
	 *
	 * @var string
	 * @since 1.0.0
	 */
	private $export_file_location = __DIR__ . '/../../../../../uploads/contacts.csv';

	/**
	 * Contact object arguments
	 *
	 * @var object
	 * @since 1.0.0
	 */
	public $contact_args;

	/**
	 * Create a new contact or update a existing contact
	 *
	 * @param WP_REST_Request $request Request object used to generate the response.
	 * @return WP_REST_Response
	 * @since 1.0.0
	 */
	public function create_or_update( WP_REST_Request $request ) {
		// Get values from API.
		$params = MRM_Common::get_api_params_values( $request );
		// Email address validation.
		if ( isset( $params['email'] ) ) {
			$email = sanitize_text_field( $params['email'] );
			if ( empty( $email ) ) {
				return $this->get_error_response( __( 'Email address is mandatory', 'mrm' ), 200 );
			}

			if ( ! is_email( $email ) ) {
				return $this->get_error_response( __( 'Enter a valid email address', 'mrm' ), 200 );
			}
			$exist = ContactModel::is_contact_exist( $email );
			if ( $exist && ! isset( $params['contact_id'] ) ) {
				return $this->get_error_response( __( 'Email address already assigned to another contact.', 'mrm' ), 200 );
			}
		}

		// Contact object create and insert or update to database.
		try {
			if ( isset( $params['contact_id'] ) ) {
				$contact_id = isset( $params['contact_id'] ) ? $params['contact_id'] : '';
				// Existing contact email address check.
				$other_slugs = ContactModel::is_contact_exist( $email );
				$update_slug = ContactModel::is_contact_exist_by_id( $email, $contact_id );
				if ( $other_slugs && ! $update_slug ) {
					return $this->get_error_response( __( 'Email address already assigned to another contact.', 'mrm' ), 200 );
				}
				$contact_id = ContactModel::update( $params, $contact_id );
			} else {
				$contact    = new ContactData( $email, $params );
				$contact_id = ContactModel::insert( $contact );
				if ( isset( $params['status'][0] ) && 'pending' === $params['status'][0] || empty( $params['status'][0] ) ) {
					MessageController::get_instance()->send_double_opt_in( $contact_id );
				}
			}

			if ( isset( $params['tags'] ) ) {
				TagController::set_tags_to_contact( $params['tags'], $contact_id );
			}

			if ( isset( $params['lists'] ) ) {
				ListController::set_lists_to_contact( $params['lists'], $contact_id );
			}

			if ( $contact_id ) {
				return $this->get_success_response( __( 'Contact has been saved successfully', 'mrm' ), 201 );
			}
			return $this->get_error_response( __( 'Failed to save', 'mrm' ), 400 );
		} catch ( Exception $e ) {
				return $this->get_error_response( __( 'Contact is not valid', 'mrm' ), 400 );
		}
	}


	/**
	 * Return a contact details
	 *
	 * @param WP_REST_Request $request Request object used to generate the response.
	 * @return WP_REST_Response
	 * @since 1.0.0
	 */
	public function get_single( WP_REST_Request $request ) {
		// Get values from API.
		$params     = MRM_Common::get_api_params_values( $request );
		$contact_id = isset( $params['contact_id'] ) ? $params['contact_id'] : '';
		$contact    = ContactModel::get( $contact_id );

		// Get and merge tags and lists.
		if ( $contact ) {
			$contact               = TagController::get_tags_to_contact( $contact );
			$contact               = ListController::get_lists_to_contact( $contact );
			$contact               = NoteController::get_notes_to_contact( $contact );
			$contact['messages']   = MessageModel::get_messages( $contact_id );
			$contact['activities'] = isset( $contact['notes'], $contact['messages'] ) && is_array( $contact['notes'] ) && is_array( $contact['messages'] )
				? array_merge( $contact['notes'], $contact['messages'] ) : array();

			if ( ! empty( $contact['activities'] ) ) {
				$created_time_column = array_column( $contact['activities'], 'created_time' );
				array_multisort( $created_time_column, SORT_DESC, $contact['activities'] );
			}
		}

		if ( $contact && isset( $contact['email'] ) ) {
			if ( isset( $contact['created_at'] ) ) {
				$time         = new \DateTimeImmutable( $contact['created_at'], wp_timezone() );
				$created_time = $time->format( 'h:i a' );

				$contact['created_time'] = $created_time;
			}

			if ( isset( $contact['created_by'] ) && ! empty( $contact['created_by'] ) ) {
				$user_meta = get_userdata( $contact['created_by'] );
			}

			$contact ['added_by_login'] = ! empty( $user_meta->data->user_login ) ? $user_meta->data->user_login : 'External Source';

			$avatar_url = add_query_arg(
				array(
					's' => '100',
					'd' => 'retro',
				),
				esc_url( 'https://www.gravatar.com/avatar/' . md5( $contact['email'] ) )
			);

			$contact ['avatar_url'] = $avatar_url;
			return $this->get_success_response( 'Query Successfull', 200, $contact );
		}
		return $this->get_error_response( 'Failed to Get Data', 400 );
	}


	/**
	 * Return Contacts for list view
	 *
	 * @param WP_REST_Request $request Request object used to generate the response.
	 * @return WP_REST_Response
	 * @since 1.0.0
	 */
	public function get_all( WP_REST_Request $request ) {
		// Get values from API.
		$params = MRM_Common::get_api_params_values( $request );

		$page     = isset( $params['page'] ) ? $params['page'] : 1;
		$per_page = isset( $params['per-page'] ) ? $params['per-page'] : 10;
		$offset   = ( $page - 1 ) * $per_page;

		// Contact Search keyword.
		$search = isset( $params['search'] ) ? $params['search'] : '';

		$contacts = ContactModel::get_all( $offset, $per_page, $search );

		// Merge tags and lists to contacts.
		$contacts['data'] = array_map(
			function( $contact ) {
				$contact = TagController::get_tags_to_contact( $contact );
				$contact = ListController::get_lists_to_contact( $contact );
				return $contact;
			},
			$contacts['data']
		);

		// Count contacts groups.
		$contacts['count_groups'] = array(
			'lists'    => ContactGroupModel::get_groups_count( 'lists' ),
			'tags'     => ContactGroupModel::get_groups_count( 'tags' ),
			'segments' => ContactGroupModel::get_groups_count( 'segments' ),
			'contacts' => absint( $contacts['total_count'] ),
		);

		// Count contacts based on status.
		$contacts['count_status'] = array(
			'subscribed'   => ContactModel::get_contacts_status_count( 'subscribed' ),
			'unsubscribed' => ContactModel::get_contacts_status_count( 'unsubscribed' ),
			'pending'      => ContactModel::get_contacts_status_count( 'pending' ),
		);

		$contacts['current_page'] = (int) $page;

		if ( isset( $contacts ) ) {
			return $this->get_success_response( __( 'Query Successfull', 'mrm' ), 200, $contacts );
		}
		return $this->get_error_response( __( 'Failed to get data', 'mrm' ), 400 );
	}


	/**
	 * Delete a contact
	 *
	 * @param WP_REST_Request $request Request object used to generate the response.
	 * @return WP_REST_Response
	 * @since 1.0.0
	 */
	public function delete_single( WP_REST_Request $request ) {
		// Get values from API.
		$params = MRM_Common::get_api_params_values( $request );

		$success = ContactModel::destroy( $params['contact_id'] );

		if ( $success ) {
			return $this->get_success_response( __( 'Contact has been deleted successfully', 'mrm' ), 200 );
		}
		return $this->get_error_response( __( 'Failed to delete', 'mrm' ), 400 );
	}


	/**
	 * Delete multiple contacts
	 *
	 * @param WP_REST_Request $request Request object used to generate the response.
	 * @return WP_REST_Response
	 * @since 1.0.0
	 */
	public function delete_all( WP_REST_Request $request ) {
		// Get values from API.
		$params = MRM_Common::get_api_params_values( $request );

		$success = ContactModel::destroy_all( $params['contact_ids'] );

		if ( $success ) {
			return $this->get_success_response( __( 'Contacts has been deleted successfully', 'mrm' ), 200 );
		}
		return $this->get_error_response( __( 'Failed to Delete', 'mrm' ), 400 );
	}


	/**
	 * Remove tags, lists, and segments from a contact
	 *
	 * @param WP_REST_Request $request Request object used to generate the response.
	 * @return WP_REST_Response
	 * @since 1.0.0
	 */
	public function delete_groups( WP_REST_Request $request ) {
		$success = ContactPivotController::get_instance()->delete_groups( $request );

		if ( $success ) {
			return $this->get_success_response( __( 'Tag Removed Successfully', 'mrm' ), 200 );
		}
		return $this->get_error_response( __( 'Failed to Remove', 'mrm' ), 400 );
	}


	/**
	 * Set tags, lists, and segments to a contact
	 *
	 * @param WP_REST_Request $request Request object used to generate the response.
	 * @return WP_REST_Response
	 * @since 1.0.0
	 */
	public function set_groups( WP_REST_Request $request ) {
		// Get values from API.
		$params  = MRM_Common::get_api_params_values( $request );
		$is_tag  = false;
		$is_list = false;

		if ( isset( $params['tags'], $params['contact_id'] ) ) {
			if ( empty( $params['tags'] ) ) {
				return $this->get_error_response( __( 'Please select an item first', 'mrm' ), 400 );
			}
			$success = TagController::set_tags_to_contact( $params['tags'], $params['contact_id'] );
			$is_tag  = true;
		}

		if ( isset( $params['lists'], $params['contact_id'] ) ) {
			if ( empty( $params['lists'] ) ) {
				return $this->get_error_response( __( 'Please select an item first', 'mrm' ), 400 );
			}
			$success = ListController::set_lists_to_contact( $params['lists'], $params['contact_id'] );
			$is_list = true;
		}

		if ( $success && $is_list && $is_tag ) {
			return $this->get_success_response( __( 'Tag and List added Successfully', 'mrm' ), 201 );
		} elseif ( $success && $is_tag ) {
			return $this->get_success_response( __( 'Tag added Successfully', 'mrm' ), 201 );
		} elseif ( $success && $is_list ) {
			return $this->get_success_response( __( 'List added Successfully', 'mrm' ), 201 );
		}
		return $this->get_error_response( __( 'Failed to add', 'mrm' ), 400 );
	}

	/**
	 * Set tags, lists to multiple contacts
	 *
	 * @param WP_REST_Request $request Request object used to generate the response.
	 * @return WP_REST_Response
	 * @since 1.0.0
	 */
	public function set_groups_to_multiple( WP_REST_Request $request ) {
		// Get values from API.
		$params = MRM_Common::get_api_params_values( $request );

		$is_tag  = false;
		$is_list = false;

		if ( isset( $params['tags'] ) && isset( $params['contact_ids'] ) ) {
			$success = TagController::set_tags_to_multiple_contacts( $params['tags'], $params['contact_ids'] );
			$is_tag  = true;
		}

		if ( isset( $params['lists'] ) && isset( $params['contact_ids'] ) ) {
			$success = ListController::set_lists_to_multiple_contacts( $params['lists'], $params['contact_ids'] );
			$is_list = true;
		}

		if ( $success && $is_list && $is_tag ) {
			return $this->get_success_response( __( 'Tag and List has been added Successfully', 'mrm' ), 201 );
		} elseif ( $success && $is_tag ) {
			return $this->get_success_response( __( 'Tag has been added Successfully', 'mrm' ), 201 );
		} elseif ( $success && $is_list ) {
			return $this->get_success_response( __( 'List has been added Successfully', 'mrm' ), 201 );
		}
		return $this->get_error_response( __( 'Select an item first', 'mrm' ), 400 );
	}


	/**
	 * Export contacts controller
	 *
	 * @param WP_REST_Request $request Request object used to generate the response.
	 * @return WP_REST_Response
	 * @throws Exception    $e Throws an exception if the action could not be saved.
	 * @since 1.0.0
	 */
	public function export_contacts( WP_REST_Request $request ) {
		try {
			$body        = $request->get_json_params();
			$export_json = json_decode( wp_json_encode( $body['export'] ), true );
			if ( ! isset( $body ) && empty( $body['export'] ) ) {
				throw new Exception( __( 'Export Array with necessary field names is required.', 'mrm' ) );
			}
			if ( file_exists( $this->export_file_location ) ) {
				unlink( $this->export_file_location );
			}
			$csv_writer = Writer::createFromPath( $this->export_file_location, 'w+' );
			// write csv header.
			$csv_writer->insertOne( $export_json );
			$page  = 1;
			$limit = 25;
			do {
				$offset                  = ( $page - 1 ) * $limit;
				$data                    = ContactModel::get_all( $offset, $limit );
				$total_pages             = $data['total_pages'];
				$contacts_batch_array    = $data['data'];
				$contacts_batch_filtered = array_map(
					function( $record ) use ( $export_json ) {
						$filtered = array();
						foreach ( $record as $key => $value ) {
							if ( in_array( $key, $export_json, true ) ) {
								$filtered[ $key ] = $value;
							}
						}
						return $filtered;
					},
					$contacts_batch_array
				);
				$csv_writer->insertAll( $contacts_batch_filtered );
			} while ( $page++ <= $total_pages );
		} catch ( Exception $e ) {
			return $this->get_error_response( __( 'Failed to Export Contacts', 'mrm' ), 400 );
		}
		return $this->get_success_response( __( 'Export Successful', 'mrm' ), 200 );
	}


	/**
	 * Saves the uploaded import file in filesystem
	 * sends both csv file attrs and system contacts attrs as an array to user
	 *
	 * @param WP_REST_Request $request Request object used to generate the response.
	 * @return WP_REST_Response
	 * @since 1.0.0
	 */
	public function import_contacts_get_attrs( WP_REST_Request $request ) {
		// Get values from API.
		$params          = MRM_Common::get_api_params_values( $request );
		$params['files'] = $request->get_file_params();

		$files = isset( $params['files'] ) ? $params['files'] : '';

		$csv_mimes = MRM_Common::csv_mimes();

		$file_csv_type     = isset( $files['csv']['type'] ) ? $files['csv']['type'] : '';
		$file_csv_tmp_name = isset( $files['csv']['tmp_name'] ) ? $files['csv']['tmp_name'] : '';
		$files_csv         = isset( $files['csv'] ) ? $files['csv'] : '';
		// CSV file upload validation.
		if ( empty( $files ) ||
			! is_array( $files_csv ) ||
			! is_uploaded_file( $file_csv_tmp_name ) ||
			! in_array( $file_csv_type, $csv_mimes, true )
			) {
			return $this->get_error_response( __( 'Please upload a CSV first', 'mrm' ) );
		}

		try {
			$delimiter = isset( $params['delimiter'] ) && ! empty( $params['delimiter'] ) ? $params['delimiter'] : 'comma';

			if ( 'comma' === $delimiter ) {
				$delimiter = ',';
			} else {
				$delimiter = ';';
			}

			$import_res = MRM_Importer::create_csv_from_import( $files_csv, $delimiter );
			if ( ! is_array( $import_res ) ) {
				return $this->get_error_response( is_string( $import_res ) ? $import_res : __( 'Unknown error occurred', 'mrm' ), null, 500 );
			}

			$this->import_file_location = isset( $import_res['file'] ) ? $import_res['file'] : '';

			$options = MRM_Importer::prepare_mapping_options_from_csv( $this->import_file_location, $import_res['delimiter'] );

			if ( isset( $options['headers'] ) && empty( $options['headers'] ) ) {
				return $this->get_error_response( __( 'File is incompatible.', 'mrm' ), 400 );
			}
			$result = array(
				'headers' => $options['headers'],
				'fields'  => isset( $options['fields'] ) ? $options['fields'] : '',
				'file'    => isset( $import_res['new_file_name'] ) ? $import_res['new_file_name'] : '',
			);
			return $this->get_success_response( __( 'File has been uploaded successfully.', 'mrm' ), 200, $result );
		} catch ( Exception $e ) {
			return $this->get_error_response( __( 'File has not been uploaded.', 'mrm' ), 400 );
		}
	}

	/**
	 * Parse raw textarea data input and send the headers back to the user
	 *
	 * @param WP_REST_Request $request Request object used to generate the response.
	 * @throws Exception    $e Throws an exception if the action could not be saved.
	 * @return WP_REST_Response
	 * @since 1.0.0
	 */
	public function import_contacts_raw_get_attrs( WP_REST_Request $request ) {
		try {
			// Get parameters.
			$params = MRM_Common::get_api_params_values( $request );
			$raw    = isset( $params['raw'] ) ? $params['raw'] : '';

			if ( empty( $raw ) ) {
				return $this->get_error_response( __( 'Please paste some data in the textarea.', 'mrm' ) );
			}
			// check for least number of characters.
			if ( strlen( $raw ) < 5 ) {
				throw new Exception( 'Data is insufficient. Please enter at least 5 characters.' );
			}
			$array = preg_split( "/\r\n|\n|\r/", $raw );
			if ( count( $array ) > 1 ) {
				$array[0] = trim( $array[0] ); // trim whitespaces for first line.
				$headers  = explode( ',', $array[0] );
			} else {
				throw new Exception( 'Make sure the data contains comma seperated values with a valid header and has at least one row of data.' );
			}

			$result = array(
				'raw'     => $array, // need to send the data back to the user for using in actual importing.
				'headers' => $headers,
				'fields'  => Constants::$contacts_attrs,
			);
			return $this->get_success_response( __( 'File has been uploaded successfully.', 'mrm' ), 200, $result );
		} catch ( Exception $e ) {
			return $this->get_error_response( __( 'File has not been uploaded', 'mrm' ), 400 );
		}
	}

	/**
	 * Parse api key from user and send the lists, headers, fields to the user
	 *
	 * @param WP_REST_Request $request Request object used to generate the response.
	 * @throws Exception    $e Throws an exception if the action could not be saved.
	 * @return WP_REST_Response
	 * @since 1.0.0
	 */
	public function import_contacts_mailchimp_get_attrs( WP_REST_Request $request ) {
		try {
			// Get parameters.
			$params    = MRM_Common::get_api_params_values( $request );
			$key       = isset( $params['key'] ) ? $params['key'] : '';
			$mailchimp = new MailchimpMarketing\ApiClient();
			if ( empty( $key ) ) {
				throw new Exception( 'Please send the api key in order to proceed' );
			}
			$key_array = explode( '-', $key );
			if ( count( $key_array ) > 1 ) {
				$key_server = $key_array[1];
			} else {
				throw new Exception( 'Cannot figure out the server from the api key.' );
			}
			$mailchimp->setConfig(
				array(
					'apiKey' => $key,
					'server' => $key_server,
				)
			);
			$response = $mailchimp->lists->getAllLists();
			return $this->get_success_response(
				__( 'List retrieved successfully', 'mrm' ),
				200,
				array(
					'response' => $response,
					'headers'  => array( 'name', 'email' ),
					'fields'   => Constants::$contacts_attrs,
				)
			);
		} catch ( Exception $e ) {
			return $this->get_error_response( __( 'List retrieve failed', 'mrm' ), 400 );
		}
	}




	/**
	 * Prepare contact object from the uploaded CSV
	 * Inseret contcts data into database
	 *
	 * @param WP_REST_Request $request Request object used to generate the response.
	 * @throws Exception    $e Throws an exception if the action could not be saved.
	 * @return WP_REST_Response
	 * @since 1.0.0
	 */
	public function import_contacts_csv( WP_REST_Request $request ) {
		$skipped     = 0;
		$exists      = 0;
		$total_count = 0;
		// Get values from API.
		$params = MRM_Common::get_api_params_values( $request );
		try {
			if ( isset( $params ) && empty( $params['map'] ) ) {
				throw new Exception( __( 'Map attribute is required.', 'mrm' ) );
			}

			$mappings = isset( $params['map'] ) ? $params['map'] : array();

			if ( isset( $params['file'] ) ) {
				$file = MRM_IMPORT_DIR . '/' . $params['file'];
			}

			// if the file does not exist return error.
			if ( ! file_exists( $file ) ) {
				throw new Exception( __( 'The File is not found on this server.', 'mrm' ) );
			}

			// open the file stream.
			// phpcs:disable
			$handle = fopen( $file, 'r' );
			// phpcs:enable
			// fetch the first line.
			$raw_string = fgets( $handle );

			// parse it to and get the header.
			$header = str_getcsv( $raw_string );
			if ( isset( $header[0] ) ) {
				$header[0] = MRM_Importer::remove_utf8_bom( $header[0] );
			}

			// Iterate over every line of the file.
			while ( ( $raw_string = fgets( $handle ) ) !== false ) { // phpcs:disable WordPress.CodeAnalysis.AssignmentInCondition.FoundInWhileCondition
				// Parse the raw csv string as an array.
				$row = str_getcsv( $raw_string );

				// check if header and the current row has same length otherwise skip to the next iteration.
				if ( count( $header ) !== count( $row ) ) {
					$skipped++;
					$total_count++;
					continue;
				}
				// combine header and values to make a contact associative array.
				$csv_contact = array_combine( $header, $row );

				$status       = isset( $params['status'] ) ? $params['status'] : '';
				$created_by   = isset( $params['created_by'] ) ? $params['created_by'] : '';
				$contact_args = array(
					'status'      => $status,
					'source'      => 'csv',
					'meta_fields' => array(),
					'created_by'  => $created_by,
				);

				foreach ( $mappings as $map ) {
					$target = isset( $map['target'] ) ? $map['target'] : '';
					$source = isset( $map['source'] ) ? $map['source'] : '';

					if ( in_array( $target, array( 'first_name', 'last_name', 'email' ), true ) ) {
						$contact_args[ $target ] = $csv_contact[ $source ];
					} else {
						$contact_args['meta_fields'][ $target ] = $csv_contact[ $source ];
					}
				}
				if ( ! array_key_exists( 'email', $contact_args ) ) {
					return $this->get_error_response( __( 'The email field is required.', 'mrm' ), 400 );
				}
				$contact_email = trim( $contact_args['email'] );
				if ( $contact_email && is_email( $contact_email ) ) {
					$is_exists = ContactModel::is_contact_exist( $contact_email );
					if ( ! $is_exists ) {
						$contact    = new ContactData( $contact_email, $contact_args );
						$contact_id = ContactModel::insert( $contact );

						if ( isset( $contact_args['status'][0] ) && 'pending' === $contact_args['status'][0] ) {
							MessageController::get_instance()->send_double_opt_in( $contact_id );
						}
						if ( isset( $params['tags'] ) ) {
							TagController::set_tags_to_contact( $params['tags'], $contact_id );
						}

						if ( isset( $params['lists'] ) ) {
							ListController::set_lists_to_contact( $params['lists'], $contact_id );
						}
					} else {
						$exists++;
					}
				} else {
					$skipped++;
				}
				$total_count++;
			}
			// phpcs:disable
			fclose( $handle );
			// phpcs:enable 
			/**
			 * Prepare data for sucess response.
			 */
			$result = array(
				'total'             => $total_count,
				'skipped'           => $skipped,
				'existing_contacts' => $exists,
			);

			wp_delete_file( $file );

			return $this->get_success_response( __( 'Import contact has been successful', 'mrm' ), 200, $result );
		} catch ( Exception $e ) {
			return $this->get_error_response( __( 'Contact Import Failed', 'mrm' ), 400 );
		}
	}

	/**
	 * Prepare contact object from the uploaded CSV
	 * Inseret contcts data into database
	 *
	 * @param WP_REST_Request $request Request object used to generate the response.
	 * @throws Exception    $e Throws an exception if the action could not be saved.
	 * @return WP_REST_Response
	 * @since 1.0.0
	 */
	public function import_contacts_raw( WP_REST_Request $request ) {
		$skipped     = 0;
		$exists      = 0;
		$total_count = 0;

		// Get values from API.
		$params = MRM_Common::get_api_params_values( $request );
		try {
			if ( isset( $params['map'] ) && empty( $params['map'] ) ) {
				throw new Exception( __( 'Please map at least one field to desired field.', 'mrm' ) );
			}

			$mappings = isset( $params['map'] ) ? $params['map'] : array();
			$raw      = isset( $params['raw'] ) ? $params['raw'] : '';
			if ( empty( $raw ) || ! is_array( $raw ) || count( $raw ) <= 1 ) {
				throw new Exception( __( 'The data is invalid.', 'mrm' ) );
			}

			if ( isset( $raw[0] ) ) {
				$header = explode( ',', trim( $raw[0] ) );
			}

			// Iterate over every line of the file.
			$row_count = count( $raw );
			for ( $i = 1; $i < $row_count; $i++ ) {
				// Trim and Parse the raw  string as an array.
				if ( isset( $raw[ $i ] ) ) {
					$row = trim( $raw[ $i ] );
				}
				$row_array = explode( ',', $row );
				// check if header and the current row has same length otherwise skip to the next iteration.
				if ( count( $header ) !== count( $row_array ) ) {
					$skipped++;
					$total_count++;
					continue;
				}
				// combine header and values to make a contact associative array.
				$csv_contact = array_combine( $header, $row_array );

				$status     = isset( $params['status'] ) ? $params['status'] : '';
				$created_by = isset( $params['created_by'] ) ? $params['created_by'] : '';

				$contact_args = array(
					'status'      => $status,
					'source'      => 'raw',
					'meta_fields' => array(),
					'created_by'  => $created_by,
				);

				foreach ( $mappings as $map ) {
					$target = isset( $map['target'] ) ? $map['target'] : '';
					$source = isset( $map['source'] ) ? $map['source'] : '';

					if ( in_array( $target, array( 'first_name', 'last_name', 'email' ), true ) ) {
						$contact_args[ $target ] = $csv_contact[ $source ];
					} else {
						$contact_args['meta_fields'][ $target ] = $csv_contact[ $source ];
					}
				}
				if ( ! array_key_exists( 'email', $contact_args ) ) {
					return $this->get_error_response( __( 'The email field is required.', 'mrm' ), 400 );
				}
				$contact_email = trim( $contact_args['email'] );
				if ( $contact_email && is_email( $contact_email ) ) {
					$is_exists = ContactModel::is_contact_exist( $contact_email );

					if ( ! $is_exists ) {
						$contact    = new ContactData( $contact_email, $contact_args );
						$contact_id = ContactModel::insert( $contact );

						if ( isset( $contact_args['status'][0] ) && 'pending' === $contact_args['status'][0] ) {
							MessageController::get_instance()->send_double_opt_in( $contact_id );
						}
						if ( isset( $params['tags'] ) ) {
							TagController::set_tags_to_contact( $params['tags'], $contact_id );
						}

						if ( isset( $params['lists'] ) ) {
							ListController::set_lists_to_contact( $params['lists'], $contact_id );
						}
					} else {
						$exists++;
					}
				} else {
					$skipped++;
				}
				$total_count++;
			}
			/**
			 * Prepare data for success response.
			 */
			$result = array(
				'total'             => $total_count,
				'skipped'           => $skipped,
				'existing_contacts' => $exists,
			);
			return $this->get_success_response( __( 'Import contact has been successful', 'mrm' ), 200, $result );
		} catch ( Exception $e ) {
			return $this->get_error_response( __( 'Contact Import Failed', 'mrm' ), 400 );
		}
	}

	/**
	 * Prepare contact object from the uploaded CSV
	 * Inseret contcts data into database
	 *
	 * @param WP_REST_Request $request Request object used to generate the response.
	 * @throws Exception    $e Throws an exception if the action could not be saved.
	 * @return WP_REST_Response
	 * @since 1.0.0
	 */
	public function import_contacts_mailchimp( WP_REST_Request $request ) {

		// Get values from API.
		$params = MRM_Common::get_api_params_values( $request );
		try {
			if ( isset( $params['map'] ) && empty( $params['map'] ) ) {
				throw new Exception( __( 'Please map at least one field for importing', 'mrm' ) );
			}

			return $this->get_success_response( __( 'Import contact from mailchimp has been successful', 'mrm' ), 200 );
		} catch ( Exception $e ) {
			return $this->get_error_response( __( 'Import contact from mailchimp has not been successful', 'mrm' ), 400 );
		}
	}



	/**
	 * Get all roles from the WordPress core
	 *
	 * @return WP_REST_Response
	 * @since 1.0.0
	 */
	public function get_native_wp_roles() {
		$roles = MRM_Importer::get_wp_roles();

		if ( isset( $roles ) ) {
			return $this->get_success_response( __( 'Query Successful.', 'mrm' ), 200, $roles );
		}
		return $this->get_error_response( __( 'Failed to retrieve', 'mrm' ), 400 );
	}


	/**
	 * Import contacts from WordPress
	 *
	 * @param WP_REST_Request $request Request object used to generate the response.
	 * @return WP_REST_Response
	 * @since 1.0.0
	 */
	public function import_contacts_native_wp( WP_REST_Request $request ) {
		// Get values from API.
		$params = MRM_Common::get_api_params_values( $request );

		try {
			if ( isset( $params['roles'] ) && empty( $params['roles'] ) ) {
				return $this->get_error_response( __( 'Roles attribute is required.', 'mrm' ), 200 );
			}

			$wp_users = MRM_Importer::get_wp_users( $params['roles'] );

			$contacts = array_map(
				function( $wp_user ) {
					$user_data = $wp_user->data;

					if ( isset( $user_data ) ) {
						$user_metadata   = $user_data->usermeta;
						$email           = $user_data->user_email;
						$id              = $user_data->ID;
						$user_registered = $user_data->user_registered;
						$user_pass       = $user_data->user_pass;
						$user_login      = $user_data->user_login;
					}
					return array_merge(
						array(
							'user_email'      => $email,
							'id'              => $id,
							'user_registered' => $user_registered,
							'user_pass'       => $user_pass,
							'user_login'      => $user_login,
						),
						$user_metadata
					);
				},
				$wp_users
			);
			return $this->get_success_response( __( 'Import has been successful', 'mrm' ), 201, $contacts );
		} catch ( Exception $e ) {
			return $this->get_error_response( __( 'Import has not been successful', 'mrm' ), 200 );
		}
	}


	/**
	 * Insert native WP users as contacts into database
	 *
	 * @param WP_REST_Request $request Request object used to generate the response.
	 *
	 * @return array
	 * @since 1.0.0
	 */
	public function insert_native_wp_contacts( WP_REST_Request $request ) {
		$skipped     = 0;
		$exists      = 0;
		$total_count = 0;
		// Get values from API.
		$params = MRM_Common::get_api_params_values( $request );

		$contacts = isset( $params['contacts'] ) ? $params['contacts'] : array();
		try {
			foreach ( $contacts as $contact ) {
				$contact       = new ContactData(
					$contact['user_email'],
					array(
						'first_name' => $contact['first_name'],
						'last_name'  => $contact['last_name'],
						'status'     => $params['status'],
						'source'     => 'WordPress',
						'created_by' => $params['created_by'],
						'wp_user_id' => $contact['id'],
					)
				);
				$contact_email = trim( $contact->get_email() );
				if ( $contact_email && is_email( $contact_email ) ) {
					$is_exists = ContactModel::is_contact_exist( $contact_email );

					if ( ! $is_exists ) {
						$contact_id = ContactModel::insert( $contact );
						$status     = isset( $params['status'] ) ? $params['status'][0] : 'pending';

						if ( 'pending' === $status ) {
							MessageController::get_instance()->send_double_opt_in( $contact_id );
						}

						if ( isset( $params['tags'] ) ) {
							TagController::set_tags_to_contact( $params['tags'], $contact_id );
						}

						if ( isset( $params['lists'] ) ) {
							ListController::set_lists_to_contact( $params['lists'], $contact_id );
						}
					} else {
						++$exists;
					}
				} else {
					++$skipped;
				}
				++$total_count;
			}
			/**
			 * Prepare data for success response.
			 */
			$result = array(
				'total'             => $total_count,
				'skipped'           => $skipped,
				'existing_contacts' => $exists,
			);

			return $this->get_success_response( __( 'Import contact has been successful', 'mrm' ), 201, $result );
		} catch ( \Throwable $th ) {
			return $this->get_error_response( __( 'Import contact has not been successful', 'mrm' ), 200 );
		}
	}


	/**
	 * Import contacts from woocommerce customers
	 *
	 * @param WP_REST_Request $request Request object used to generate the response.
	 *
	 * @return WP_REST_Response
	 * @since 1.0.0
	 */
	public function import_contacts_native_wc( WP_REST_Request $request ) {
		// Get values from API.
		$params = MRM_Common::get_api_params_values( $request );

		try {
			$wc_customers = MRM_Importer::get_wc_customers();

			foreach ( $wc_customers as $wc_customer ) {
				if ( isset( $wc_customer ) ) {
					$email = $wc_customer['email'];
				}

				$contact = new ContactData(
					$email,
					array(
						'first_name' => $wc_customer['first_name'],
						'last_name'  => $wc_customer['last_name'],
						'status'     => $params['status'],
						'source'     => 'WooCommerce',
					)
				);

				$exists = ContactModel::is_contact_exist( $email );
				if ( ! $exists ) {
					$contact_id = ContactModel::insert( $contact );

					if ( isset( $params['tags'] ) ) {
						TagController::set_tags_to_contact( $params['tags'], $contact_id );
					}

					if ( isset( $params['lists'] ) ) {
						ListController::set_lists_to_contact( $params['lists'], $contact_id );
					}
				}
			}
			return $this->get_success_response( __( 'Import has been successful', 'mrm' ), 200 );
		} catch ( Exception $e ) {
			return $this->get_error_response( __( 'Import has not been successful', 'mrm' ), 400 );
		}
	}


	/**
	 * Send a message to contact
	 *
	 * @param WP_REST_Request $request Request object used to generate the response.
	 *
	 * @return WP_REST_Response
	 * @since 1.0.0
	 */
	public function send_message( WP_REST_Request $request ) {
		return MessageController::get_instance()->create_or_update( $request );
	}


	/**
	 * Send double opt-in email for pending status
	 *
	 * @param WP_REST_Request $request Request object used to generate the response.
	 *
	 * @return WP_REST_Response
	 * @since 1.0.0
	 */
	public function send_double_opt_in( WP_REST_Request $request ) {
		// Get values from API.
		$params     = MRM_Common::get_api_params_values( $request );
		$contact_id = isset( $params['contact_id'] ) ? $params['contact_id'] : '';
		$success    = MessageController::get_instance()->send_double_opt_in( $contact_id );
		if ( $success ) {
			return $this->get_success_response( 'Double Optin email has been sent', 200 );
		} else {
			return $this->get_error_response( __( 'Double opt-in subscription process is disable', 'mrm' ), 400 );
		}
		return $this->get_error_response( 'Failed to send double optin email', 400 );
	}


	/**
	 * Get all emails to a contact
	 *
	 * @param WP_REST_Request $request Request object used to generate the response.
	 * @return WP_REST_Response
	 * @since 1.0.0
	 */
	public function get_all_emails( WP_REST_Request $request ) {
		return MessageController::get_instance()->get_all( $request );
	}

	/**
	 * Return Filtered Contacts for list view
	 *
	 * @param WP_REST_Request $request Request object used to generate the response.
	 * @return WP_REST_Response
	 * @since 1.0.0
	 */
	public function get_filtered_contacts( WP_REST_Request $request ) {
		// Get values from API.
		$params   = MRM_Common::get_api_params_values( $request );
		$page     = isset( $params['page'] ) ? $params['page'] : 1;
		$per_page = isset( $params['per-page'] ) ? $params['per-page'] : 25;
		$offset   = ( $page - 1 ) * $per_page;

		// Contact Search keyword.
		$search = isset( $params['search'] ) ? sanitize_text_field( $params['search'] ) : '';

		$tags_ids   = isset( $params['tags_ids'] ) ? $params['tags_ids'] : array();
		$lists_ids  = isset( $params['lists_ids'] ) ? $params['lists_ids'] : array();
		$status_arr = isset( $params['status'] ) ? $params['status'] : array();

		$contacts = ContactModel::get_filtered_contacts( $status_arr, $tags_ids, $lists_ids, $per_page, $offset, $search );

		if ( isset( $contacts['data'] ) ) {
			$contacts['data'] = array_map(
				function( $contact ) {
					$contact = TagController::get_tags_to_contact( $contact );
					$contact = ListController::get_lists_to_contact( $contact );
					return $contact;
				},
				$contacts['data']
			);
		}

		if ( isset( $contacts ) ) {
			return $this->get_success_response( __( 'Query Successfull', 'mrm' ), 200, $contacts );
		}
		return $this->get_error_response( __( 'Failed to get data', 'mrm' ), 400 );
	}



	/**
	 * Create contact after form submission
	 *
	 * @param mixed $request POST request after form submission on frontend.
	 * @return void
	 * @since 1.0.0
	 */
	public function save_mrm_form_contact( $request ) {
		$email             = isset( $request['email'] ) ? sanitize_text_field( $request['email'] ) : '';
		$request['status'] = 'pending';
		$request['source'] = 'form';
		$contact           = new ContactData( $email, $request );
		ContactModel::insert( $contact );
	}

	/**
	 * Get total Contact
	 *
	 * @param mixed $request POST request after form submission on frontend.
	 * @return mixed
	 * @since 1.0.0
	 */
	public function get_total_count( $request ) {
		return ContactModel::get_instance()->get_total_count( $request );
	}


	/**
	 * Return columns array for contact index page
	 *
	 * @return WP_REST_Response
	 * @since 1.0.0
	 */
	public function get_columns() {
		$columns = InternalConstants::$contact_list_columns;

		$custom_fields      = CustomFieldModel::get_all();
		$custom_fields_data = isset( $custom_fields['data'] ) ? $custom_fields['data'] : array();
		$fields             = array_map(
			function( $custom_field ) {
							return array(
								'id'    => $custom_field['slug'],
								'value' => $custom_field['title'],
							);
			},
			$custom_fields_data
		);

		$list_columns = array_merge( $columns, $fields );
		return $this->get_success_response( __( 'Query Successfull', 'mrm' ), 200, $list_columns );
	}


	/**
	 * Save column hide/show information on wp_options table
	 *
	 * @param WP_REST_Request $request Request object used to generate the response.
	 * @return WP_REST_Response
	 * @since 1.0.0
	 */
	public function save_contact_columns( WP_REST_Request $request ) {
		$params          = MRM_Common::get_api_params_values( $request );
		$contact_columns = isset( $params['contact_columns'] ) ? $params['contact_columns'] : array();
		$success         = update_option( 'mrm_contact_columns', maybe_serialize( $contact_columns ) );
		if ( $success ) {
			return $this->get_success_response( __( 'Columns has been save successfully', 'mrm' ), 201, $contact_columns );
		}
		return $this->get_error_response( __( 'Failed to save columns', 'mrm' ), 400 );
	}


	/**
	 * Return stored column information from wp_options table
	 *
	 * @return WP_REST_Response
	 * @since 1.0.0
	 */
	public function get_stored_columns() {
		$contact_columns = get_option( 'mrm_contact_columns' );
		$columns         = maybe_unserialize( $contact_columns );

		if ( false === $columns ) {
			$columns = array();
		}
		return $this->get_success_response( __( 'Query successfully', 'mrm' ), 200, $columns );
	}
}
