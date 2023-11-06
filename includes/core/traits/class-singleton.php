<?php
/**
 * The file that defines the plugin singleton trait.
 *
 * @link https://wordpress.org/plugins/cinemarathon
 * @package Cinemarathon
 */

namespace Cinemarathon\Core\Traits;

/**
 * Define the singleton trait.
 *
 * @since 4.0
 * @author Charlie Merland <charlie@caercam.org>
 */
trait Singleton {

	/**
	 * Static class instance.
	 * @var static
	 */
	private static $instance;

	/**
	 * Get the instance of this class, insantiating it if it doesn't exist yet.
	 *
	 * @since 4.0
	 * @static
	 * @access public
	 *
	 * @return static
	 */
	public static function instance() {

		// Store the instance locally to avoid private static replication.
        static $instance = null;

        // Only run these methods if they haven't been ran previously.
        if ( null === $instance ) {
        $instance = new static;
        }

        // Always return the instance
        return $instance;
	}
}
