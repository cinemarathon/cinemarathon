<?php
/**
 * Plugin Name:       Cinemarathons
 * Description:       Movie marathons for movie lovers.
 * Requires at least: 6.3
 * Requires PHP:      8.1
 * Version:           1.0.0
 * Author:            Charlie Merland
 * License:           GPL-2.0-or-later
 * License URI:       https://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain:       cinemarathons
 *
 * @package Cinemarathons
 */

// Make sure we don't expose any info if called directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

define( 'CINEMARATHONS_PLUGIN',  plugin_basename( __FILE__ ) );
define( 'CINEMARATHONS_VERSION', '1.0.0' );
define( 'CINEMARATHONS_PATH',    trailingslashit( plugin_dir_path( __FILE__ ) ) );
define( 'CINEMARATHONS_URL',     trailingslashit( plugin_dir_url( __FILE__ ) ) );

require_once CINEMARATHONS_PATH . 'includes/core/traits/class-singleton.php';
require_once CINEMARATHONS_PATH . 'class-cinemarathons.php';

// Plugin activation hook.
register_activation_hook( __FILE__, [ \Cinemarathons\cinemarathons::class, 'activate' ] );

\Cinemarathons\cinemarathons();
