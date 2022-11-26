<?php
/**
 * Mail Mint
 *
 * @author [MRM Team]
 * @email [support@rextheme.com]
 * @create date 2022-08-09 11:03:17
 * @modify date 2022-08-09 11:03:17
 * @package /app/DataStores
 */

namespace Mint\MRM\DataStores;

/**
 * [Manage note data]
 *
 * @desc Manage plugin's assets
 * @package /app/DataStores
 * @since 1.0.0
 */
class NoteData {
	/**
	 * Note_type
	 *
	 * @var int
	 * @since 1.0.0
	 */
	private $type;

	/**
	 * Note Title
	 *
	 * @var string
	 * @since 1.0.0
	 */
	private $title;


	/**
	 * Note Description
	 *
	 * @var longtext
	 * @since 1.0.0
	 */
	private $description;

	/**
	 * Note creator
	 *
	 * @var int
	 * @since 1.0.0
	 */
	private $created_by;


	/**
	 * Contact status
	 *
	 * @var int
	 * @since 1.0.0
	 */
	private $status = 0;

	/**
	 * Access check
	 *
	 * @var int
	 * @since 1.0.0
	 */
	private $is_public = 0;

	/**
	 * Initialize class functionalities
	 *
	 * @param array $args Custom field data.
	 *
	 * @since 1.0.0
	 */
	public function __construct( $args ) {
		$this->type        = isset( $args[ 'type' ] ) ? $args[ 'type' ] : '';
		$this->title       = isset( $args[ 'title' ] ) ? $args[ 'title' ] : '';
		$this->description = isset( $args[ 'description' ] ) ? $args[ 'description' ] : '';
		$this->status      = isset( $args[ 'status' ] ) ? $args[ 'status' ] : '';
		$this->is_public   = isset( $args[ 'is_public' ] ) ? $args[ 'is_public' ] : '';
		$this->created_by  = isset( $args[ 'created_by' ] ) ? $args[ 'created_by' ] : '';
	}


	/**
	 * Return note type
	 *
	 * @return string
	 * @since 1.0.0
	 */
	public function get_type() {
		return $this->type;
	}


	/**
	 * Return note title
	 *
	 * @return string
	 * @since 1.0.0
	 */
	public function get_title() {
		return $this->title;
	}


	/**
	 * Return note description
	 *
	 * @return string
	 * @since 1.0.0
	 */
	public function get_description() {
		return $this->description;
	}


	/**
	 * Return note status
	 *
	 * @return string
	 * @since 1.0.0
	 */
	public function get_status() {
		return $this->status;
	}


	/**
	 * Return note access
	 *
	 * @return string
	 * @since 1.0.0
	 */
	public function get_is_public() {
		return $this->is_public;
	}

	/**
	 * Return creator ID
	 *
	 * @return string
	 * @since 1.0.0
	 */
	public function get_created_by() {
		return $this->created_by;
	}
}
