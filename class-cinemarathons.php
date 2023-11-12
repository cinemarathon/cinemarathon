<?php
/**
 * The file that defines the core plugin class.
 *
 * @link https://cinemarathons.com
 * @package Cinemarathons
 */

namespace Cinemarathons;

use Cinemarathons\Core\Traits\Singleton;

/**
 * Define the main plugin class.
 *
 * @since 1.0.0
 * @author Charlie Merland <charlie@caercam.org>
 */
final class Cinemarathons {

    use Singleton;

    /**
     * @var string
     */
    private $version;

    /**
     * @var string
     */
    private $plugin_dir;
    /**
     * @var string
     */
    private $plugin_url;

    /**
     * @var string
     */
    private $include_dir;

    /**
     * @var string
     */
    private $include_url;

    /**
     * @var array
     */
    private $default_settings;

    /**
     * Constructor.
     *
     * @since 1.0.0
     * @access private
     */
    private function __construct() {

        $this->version = CINEMARATHONS_VERSION;

        $this->plugin_dir = CINEMARATHONS_PATH;
        $this->plugin_url = CINEMARATHONS_URL;

        $this->default_settings = require $this->plugin_dir . 'includes/core/config.php';

        $this->setup();
    }

    /**
     * Initialize.
     *
     * @since 1.0.0
     * @access private
     */
    private function setup() {

        // Let's get this party started.
        add_action( 'plugins_loaded', [ $this, 'run' ]) ;

        // Let's get to work.
        add_action( 'cinemarathons/run', [ $this, 'storyboard' ] );
        add_action( 'cinemarathons/run', [ $this, 'rehearsal' ] );
        add_action( 'cinemarathons/run', [ $this, 'background' ] );
        add_action( 'cinemarathons/run', [ $this, 'foreground' ] );

        // i18n
        add_action( 'cinemarathons/run', [ $this, 'translate' ] );
    }

    /**
     * Load plugin translations.
     *
     * @since 1.0.0
     * @access public
     */
    public function translate() {

        add_action( 'init', function() {
            load_plugin_textdomain( 'cinemarathons', false, CINEMARATHONS_PATH . '/languages' );
        } );

        add_filter( 'load_textdomain_mofile', function( $mofile, $domain ) {
            if ( 'cinemarathons' === $domain && false !== strpos( $mofile, WP_LANG_DIR . '/plugins/' ) ) {
                $locale = apply_filters( 'plugin_locale', determine_locale(), $domain );
                $mofile = CINEMARATHONS_PATH . "/languages/{$domain}-{$locale}.mo";
            }
            return $mofile;
        }, 10, 2 );
    }

    /**
     * Prepare plugin.
     *
     * @since 1.0.0
     * @access public
     */
    public function storyboard() {

        // Load helpers.
        require_once CINEMARATHONS_PATH . 'includes/helpers.php';

        // Load dashboard.
        if ( is_admin() ) {
            // Nothing to do here either. Yet.
        }
    }

    /**
     * Load internal features.
     *
     * @since 1.0.0
     * @access public
     */
    public function rehearsal() {

        add_action( 'init',                 [ $this, 'register_blocks' ] );
        add_filter( 'block_categories_all', [ $this, 'register_block_categories' ], 10, 2 );
    }

    /**
     * Load admin features.
     *
     * @since 1.0.0
     * @access public
     */
    public function background() {

        if ( ! is_admin() ) {
            return false;
        }

        add_action( 'admin_enqueue_scripts', [ $this, 'enqueue_admin_scripts' ] );
        add_action( 'admin_enqueue_scripts', [ $this, 'enqueue_admin_styles' ] );

        add_action( 'admin_init', [ $this, 'register_settings' ] );
        add_action( 'admin_menu', [ $this, 'register_admin_pages' ] );

        add_action( 'plugin_action_links_' . CINEMARATHONS_PLUGIN, [ $this, 'plugin_action_links' ] );
    }

    /**
     * Load public features.
     *
     * @since 1.0.0
     * @access public
     */
    public function foreground() {

        add_action( 'wp_enqueue_scripts', [ $this, 'enqueue_scripts' ] );
        add_action( 'wp_enqueue_scripts', [ $this, 'enqueue_styles' ] );
    }

    /**
     * Enqueue public-side scripts.
     *
     * @since 1.0.0
     * @access public
     */
    public function enqueue_scripts() {

        $this->register_scripts();
    }

    /**
     * Enqueue public-side styles.
     *
     * @since 1.0.0
     * @access public
     */
    public function enqueue_styles() {

        $this->register_styles();
    }

    /**
     * Register public-side scripts.
     *
     * @since 1.0.0
     * @access private
     */
    private function register_scripts() {}

    /**
     * Register public-side styles.
     *
     * @since 1.0.0
     * @access private
     */
    private function register_styles() {}

    /**
     * Enqueue admin-side scripts.
     *
     * @since 1.0.0
     * @access public
     */
    public function enqueue_admin_scripts() {

        $this->register_admin_scripts();

        wp_enqueue_script( 'cinemarathons-admin' );

        $options = get_option( 'cinemarathons_options', $this->default_settings );
        wp_add_inline_script(
            'cinemarathons-marathon-editor-script',
            'window.cinemarathonsOptions = ' . json_encode( $options + [
                'locale' => get_bloginfo( 'language' )
            ] )
        );

        wp_set_script_translations( 'cinemarathons-marathon-editor-script', 'cinemarathons', CINEMARATHONS_PATH . '/languages' );
        wp_set_script_translations( 'cinemarathons-marathons-editor-script', 'cinemarathons', CINEMARATHONS_PATH . '/languages' );
    }

    /**
     * Enqueue admin-side styles.
     *
     * @since 1.0.0
     * @access public
     */
    public function enqueue_admin_styles() {

        $this->register_admin_styles();

        wp_enqueue_style( 'cinemarathons-admin' );
    }

    /**
     * Register admin-side scripts.
     *
     * @since 1.0.0
     * @access private
     */
    private function register_admin_scripts() {

        wp_register_script( 'cinemarathons-admin', CINEMARATHONS_URL . 'assets/js/admin.js', [], $this->version, true );
    }

    /**
     * Register admin-side styles.
     *
     * @since 1.0.0
     * @access private
     */
    private function register_admin_styles() {

        wp_register_style( 'cinemarathons-admin', CINEMARATHONS_URL . 'assets/css/admin.css', [], $this->version, 'all' );
    }

    /**
     * Register plugin settings.
     * 
     * @since 1.0.0
     * @access public
     */
    public function register_settings() {

        $options = get_option( 'cinemarathons_options', $this->default_settings );

        register_setting( 'cinemarathons', 'cinemarathons_options' );

        add_settings_section(
            'cinemarathons_options',
            __( 'General Settings', 'cinemarathons' ),
            function() {
                _e( 'Basic plugin settings.', 'cinemarathons' );
            },
            'cinemarathons'
        );

        add_settings_field(
            'supported_post_types',
            'Supported Post Types',
            function() use ($options) {
                $post_types = get_post_types( [ 'public' => true ], 'objects' );
                $supported_post_types = $options['general']['supported_post_types'] ?? [ 'page' ];
                require_once CINEMARATHONS_PATH . 'templates/dashboard/settings/fields/general/post-types.php';
            },
            'cinemarathons',
            'cinemarathons_options'
        );

        add_settings_field(
            'hide_settings_page',
            'Hide Settings Page',
            function() use ($options) {
                $hide_settings_page = $options['general']['hide_settings_page'] ?? false;
                require_once CINEMARATHONS_PATH . 'templates/dashboard/settings/fields/general/hide-settings-page.php';
            },
            'cinemarathons',
            'cinemarathons_options'
        );

        add_settings_section( 'cinemarathons_integration', __( 'API Integration', 'cinemarathons' ), fn () => _e( 'You can set your own TMDb API key to retrieve TheMovieDB.org data. If you don\'t have a key, don\'t worry, the plugin will use its own. You can get your personal API key freely by registering on <a href="https://www.themoviedb.org/">TheMovieDB.org</a>.', 'cinemarathons' ), 'cinemarathons' );

        add_settings_field(
            'tmdb_api_key',
            'TMDb API key',
            function() use ($options) {
                $tmdb_api_key = $options['api']['tmdb_api_key'] ?? '';
                require_once CINEMARATHONS_PATH . 'templates/dashboard/settings/fields/api/tmdb-api-key.php';
            },
            'cinemarathons',
            'cinemarathons_integration'
        );
    }

    /**
     * Register plugin admin pages.
     * 
     * @since 1.0.0
     * @access public
     */
    public function register_admin_pages() {

        $settings = get_option( 'cinemarathons_options', $this->default_settings );
        if ( ! isset( $settings['general']['hide_settings_page'] ) ) {
            $settings['general']['hide_settings_page'] = false;
        }

        $parent_slug = '1' !== $settings['general']['hide_settings_page'] ? 'options-general.php' : false;

        add_submenu_page( $parent_slug, 'Cinemarathons Settings', 'Cinemarathons', 'manage_options', 'cinemarathons', [ $this, 'settings_page' ] );
    }

    /**
     * Settings page callback.
     * 
     * @since 1.0.0
     * @access public
     */
    public function settings_page() {

        // check user capabilities
        if ( current_user_can( 'manage_options' ) ) {
            require_once CINEMARATHONS_PATH . 'templates/dashboard/settings/settings.php';
        }
    }

    /**
     * Add new links to the Plugins Page
     *
     * @since 1.0.0
     * @access public
     * 
     * @param  array
     * @return array
     */
    public function plugin_action_links( $links ) {

        return $links + [ sprintf( '<a href="%s">%s</a>', admin_url( 'options-general.php?page=cinemarathons' ), __( 'Settings', 'cinemarathons' ) ) ];
    }

    /**
     * Register custom blocks.
     * 
     * @since 1.0.0
     * @access public
     * 
     * @return void
     */
    public function register_blocks() {

        register_block_type( __DIR__ . '/build/marathon' );
        register_block_type( __DIR__ . '/build/marathons' );
    }

    /**
     * Register custom block categories.
     * 
     * @since 1.0.0
     * @access public
     * 
     * @param  array $categories
     * @param  WP_Post $post
     * @return array
     */
    public function register_block_categories( $categories, $post ) {

        return array_merge(
            $categories,
            [
                [
                    'slug' => 'cinemarathons',
                    'title' => 'Cinemarathons',
                ],
            ]
        );
    }

    /**
	 * Filter block metadata to override template if the theme supports it.
	 *
	 * @since 1.0.0
	 * @access public
     * 
	 * @param  array $attributes
	 * @param  string $content
	 * @param  WP_Block $block
     * @return string
	 */
    public function use_theme_block_templates( $attributes, $content, $block ) {

        if ( 'cinemarathons' !== $block->block_type->category ) {
            return $content;
        }

        $template_path = get_theme_file_path( "{$block->name}.php" );
        if ( ! file_exists( $template_path ) ) {
            return $content;
        }

        ob_start();
        require $template_path;
        $content = ob_get_clean();

        return $content;
    }

    /**
     * Handle inital installation and upgrading of the plugin.
     *
     * @since 1.0.0
     * @access public
     * @static
     */
    public static function activate() {

        $db_version = get_option( 'cinemarathons_version' );
        if ( version_compare( $db_version, CINEMARATHONS_VERSION ) ) {
            update_option( 'cinemarathons_version', CINEMARATHONS_VERSION );
        }

        $options = get_option( 'cinemarathons_options', [] );
        if ( empty( $options ) ) {
            $default_settings = require CINEMARATHONS_PATH . 'includes/core/config.php';
            update_option( 'cinemarathons_options', $default_settings );
        }
    }

    /**
     * Now you wouldn't believe me if I told you, but I could run
     * like the wind blows.
     *
     * @since 1.0.0
     * @access public
     */
    public function run() {

        /**
         * Let's get this party started.
         *
         * @since 1.0.0
         *
         * @param object $this Plugin class instance, passed by reference.
         */
        do_action_ref_array( 'cinemarathons/run', [ $this ] );
    }
}

/**
 * The main function responsible for returning the one true plugin Instance
 * to functions everywhere.
 *
 * Use this function like you would a global variable, except without needing
 * to declare the global.
 *
 * Example: <?php $cinemarathons = cinemarathons(); ?>
 *
 * @since 1.0
 *
 * @return Cinemarathons The one true Cinemarathons Instance
 */
function cinemarathons() {
    return Cinemarathons::instance();
}
