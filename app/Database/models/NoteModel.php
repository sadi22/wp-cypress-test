<?php
/**
 * Manage contact note related databse operation.
 *
 * @package Mint\MRM\DataBase\Models
 * @namespace Mint\MRM\DataBase\Models
 * @author [MRM Team]
 * @email [support@rextheme.com]
 * @create date 2022-08-09 11:03:17
 * @modify date 2022-08-09 11:03:17
 */

namespace Mint\MRM\DataBase\Models;

use Exception;
use Mint\MRM\DataBase\Tables\ContactNoteSchema;
use Mint\MRM\DataBase\Tables\ContactSchema;
use Mint\MRM\DataStores\NoteData;
use MRM\Common\MRM_Common;
use Mint\Mrm\Internal\Traits\Singleton;

/**
 * NoteModel class
 *
 * Manage contact note related databse operation.
 *
 * @package Mint\MRM\DataBase\Models
 * @namespace Mint\MRM\DataBase\Models
 *
 * @version 1.0.0
 */
class NoteModel {

	use Singleton;

	/**
	 * Check existing note on database
	 *
	 * @param mixed $id Note id.
	 *
	 * @return bool
	 * @since 1.0.0
	 */
	public static function is_note_exist( $id ) {
		global $wpdb;
		$note_table = $wpdb->prefix . ContactNoteSchema::$table_name;

		// phpcs:disable WordPress.DB.PreparedSQL.NotPrepared
		$select_query = $wpdb->prepare( 'SELECT * FROM ' . $note_table . ' WHERE id = %d', array( $id ) );
		// phpcs:enable WordPress.DB.PreparedSQL.NotPrepared

		// phpcs:disable WordPress.DB.PreparedSQL.NotPrepared
		$results = $wpdb->get_results( $select_query ); // db call ok. ; no-cache ok.
		// phpcs:enable WordPress.DB.PreparedSQL.NotPrepared

		if ( $results ) {
			return true;
		}
		return false;
	}

	/**
	 * SQL query to create a new note
	 *
	 * @param NoteData $note NoteData object.
	 * @param int      $contact_id Contact id.
	 * @return bool
	 * @since 1.0.0
	 */
	public static function insert( NoteData $note, $contact_id ) {
		global $wpdb;
		$note_table = $wpdb->prefix . ContactNoteSchema::$table_name;

		try {
			$wpdb->insert(
				$note_table,
				array(
					'contact_id'  => $contact_id,
					'type'        => $note->get_type(),
					'title'       => $note->get_title(),
					'description' => $note->get_description(),
					'created_by'  => $note->get_created_by(),
					'status'      => $note->get_status(),
					'is_public'   => $note->get_is_public(),
					'created_at'  => current_time( 'mysql' ),
				)
			); // db call ok.

			return true;
		} catch ( Exception $e ) {
			return false;
		}
	}

	/**
	 * SQL query to update a note
	 *
	 * @param NoteData $note Note object.
	 * @param int      $contact_id Contact id.
	 * @param int      $note_id Note id.
	 *
	 * @return bool
	 * @since 1.0.0
	 */
	public static function update( NoteData $note, $contact_id, $note_id ) {
		global $wpdb;
		$table = $wpdb->prefix . ContactNoteSchema::$table_name;

		try {
			$wpdb->update(
				$table,
				array(
					'contact_id'  => $contact_id,
					'type'        => $note->get_type(),
					'title'       => $note->get_title(),
					'description' => $note->get_description(),
					'created_by'  => $note->get_created_by(),
					'status'      => $note->get_status(),
					'is_public'   => $note->get_is_public(),
					'updated_at'  => current_time( 'mysql' ),
				),
				array(
					'id' => $note_id,
				)
			); // db call ok. // no-cache ok.
			return true;
		} catch ( Exception $e ) {
			return false;
		}
	}

	/**
	 * Delete a note from the database
	 *
	 * @param mixed $id Note id.
	 *
	 * @return bool
	 * @since 1.0.0
	 */
	public static function destroy( $id ) {
		global $wpdb;
		$note_table = $wpdb->prefix . ContactNoteSchema::$table_name;

		try {
			$wpdb->delete( $note_table, array( 'id' => $id ) ); // db call ok. ; no-cache ok.
			return true;
		} catch ( \Exception $e ) {
			return false;
		}
	}


	/**
	 * SQL query to get all notes for a contact with pagination
	 *
	 * @param mixed  $contact_id contact id.
	 * @param int    $offset offset.
	 * @param int    $limit limit.
	 * @param string $search search Parameter.
	 *
	 * @return array|bool
	 * @since 1.0.0
	 */
	public static function get_all( $contact_id, $offset = 0, $limit = 10, $search = '' ) {
		global $wpdb;
		$table_name   = $wpdb->prefix . ContactNoteSchema::$table_name;
		$search_terms = null;

		// Search notes by title.
		if ( ! empty( $search ) ) {
			$search       = $wpdb->esc_like( $search );
			$search_terms = "AND title LIKE '%%$search%%'";
		}

		// Return notes for a contact in list view.
		// phpcs:disable WordPress.DB.PreparedSQL.InterpolatedNotPrepared
		$results = $wpdb->get_results( $wpdb->prepare( "SELECT * FROM $table_name WHERE contact_id = $contact_id {$search_terms} ORDER BY id DESC LIMIT %d, %d", array( $offset, $limit ) ), ARRAY_A ); // db call ok. ; no-cache ok.
		$count   = $wpdb->get_var( $wpdb->prepare( "SELECT COUNT(*) as total FROM $table_name WHERE contact_id = %d", array( $contact_id ) ) ); // db call ok. ; no-cache ok.
		// phpcs:disable WordPress.DB.PreparedSQL.InterpolatedNotPrepared
		$total_pages = ceil( $count / $limit );

		return array(
			'data'        => $results,
			'total_pages' => $total_pages,
			'count'       => $count,
		);
	}

	/**
	 * Run SQL Query to get a single note information
	 *
	 * @param mixed $id Note ID.
	 *
	 * @return object
	 * @since 1.0.0
	 */
	public static function get( $id ) {
		global $wpdb;
		$table_name = $wpdb->prefix . ContactNoteSchema::$table_name;

		return $wpdb->get_row( $wpdb->prepare( "SELECT id, description, type FROM {$table_name} WHERE id = %d", array( $id ) ), ARRAY_A ); // db call ok. ; no-cache ok.
	}


	/**
	 * Run sql query to get  notes information for a contact
	 *
	 * @param int $contact_id contact id.
	 *
	 * @return array
	 * @since 1.0.0
	 */
	public static function get_notes_to_contact( $contact_id ) {
		global $wpdb;
		$table_name = $wpdb->prefix . ContactNoteSchema::$table_name;
		return $wpdb->get_results( $wpdb->prepare( "SELECT * FROM $table_name WHERE contact_id = %d ORDER BY id DESC", array( $contact_id ) ), ARRAY_A ); // db call ok. ; no-cache ok.
	}


}
