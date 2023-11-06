<?php
/**
 * Plugin Name:       Cinemarathon
 * Description:       Movie marathons for movie lovers.
 * Requires at least: 6.3
 * Requires PHP:      8.1
 * Version:           1.0.0
 * Author:            Charlie Merland
 * License:           GPL-2.0-or-later
 * License URI:       https://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain:       cinemarathon
 *
 * @package           cinemarathon
 */

// Make sure we don't expose any info if called directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

define( 'CINEMARATHON_PLUGIN',  plugin_basename( __FILE__ ) );
define( 'CINEMARATHON_VERSION', '1.0.0' );
define( 'CINEMARATHON_PATH',    trailingslashit( plugin_dir_path( __FILE__ ) ) );
define( 'CINEMARATHON_URL',     trailingslashit( plugin_dir_url( __FILE__ ) ) );

require_once CINEMARATHON_PATH . 'includes/core/traits/class-singleton.php';
require_once CINEMARATHON_PATH . 'class-cinemarathon.php';

\Cinemarathon\cinemarathon();
