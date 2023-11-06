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
     * Constructor.
     *
     * @since 1.0.0
     * @access private
     */
    private function __construct() {

        $this->version = CINEMARATHONS_VERSION;

        $this->plugin_dir = plugin_dir_path( __FILE__ );
        $this->plugin_url = plugin_dir_url( __FILE__ );

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

        // i18n
        add_action( 'cinemarathons/run', [ $this, 'translate' ] );

        // Let's get to work.
        add_action( 'cinemarathons/run', [ $this, 'storyboard' ] );
        add_action( 'cinemarathons/run', [ $this, 'rehearsal' ] );
        add_action( 'cinemarathons/run', [ $this, 'background' ] );
        add_action( 'cinemarathons/run', [ $this, 'foreground' ] );

        // Plugin activation hook.
        register_activation_hook( CINEMARATHONS_PATH, [ $this, 'activate' ] );
    }

    /**
     * Load plugin translations.
     *
     * @since 1.0.0
     * @access public
     */
    public function translate() {}

    /**
     * Prepare plugin.
     *
     * @since 1.0.0
     * @access public
     */
    public function storyboard() {

        // Load helpers.
        require_once CINEMARATHONS_PATH . 'includes/helpers.php';

        // Load core.
        require_once CINEMARATHONS_PATH . 'includes/core/class-block.php';

        // Load blocks.
        require_once CINEMARATHONS_PATH . 'includes/blocks/class-marathon.php';
        require_once CINEMARATHONS_PATH . 'includes/blocks/class-marathons.php';

        // Load dashboard.
        if (is_admin()) {
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

        add_action( 'init',             [ $this, 'register_blocks' ] );
        add_filter( 'block_categories', [ $this, 'register_block_categories' ], 10, 2 );
    }

    /**
     * Load admin features.
     *
     * @since 1.0.0
     * @access public
     */
    public function background() {

        if (!is_admin()) {
            return false;
        }

        add_action( 'admin_enqueue_scripts', [ $this, 'enqueue_admin_scripts' ] );
        add_action( 'admin_enqueue_scripts', [ $this, 'enqueue_admin_styles' ] );

        add_action( 'enqueue_block_editor_assets', [ $this, 'enqueue_block_editor_scripts' ] );
        add_action( 'enqueue_block_editor_assets', [ $this, 'enqueue_block_editor_styles' ] );

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

        wp_enqueue_style( 'cinemarathons' );
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
    private function register_styles() {

        wp_register_style( 'cinemarathons', CINEMARATHONS_URL . 'build/style-index.css', [], CINEMARATHONS_VERSION, 'all' );
    }

    /**
     * Enqueue admin-side scripts.
     *
     * @since 1.0.0
     * @access public
     */
    public function enqueue_admin_scripts() {

        $this->register_admin_scripts();
    }

    /**
     * Enqueue admin-side styles.
     *
     * @since 1.0.0
     * @access public
     */
    public function enqueue_admin_styles() {

        $this->register_admin_styles();
    }

    /**
     * Register admin-side scripts.
     *
     * @since 1.0.0
     * @access private
     */
    private function register_admin_scripts() {}

    /**
     * Register admin-side styles.
     *
     * @since 1.0.0
     * @access private
     */
    private function register_admin_styles() {}

    /**
     * Enqueue block editor scripts.
     *
     * @since 1.0.0
     * @access public
     */
    public function enqueue_block_editor_scripts() {

        $this->register_block_editor_scripts();

        wp_enqueue_script( 'cinemarathons' );
    }

    /**
     * Enqueue block editor styles.
     *
     * @since 1.0.0
     * @access public
     */
    public function enqueue_block_editor_styles() {

        $this->register_block_editor_styles();

        wp_enqueue_style( 'cinemarathons' );
    }

    /**
     * Register block editor scripts.
     *
     * @since 1.0.0
     * @access private
     */
    private function register_block_editor_scripts() {

        $assets = require_once CINEMARATHONS_PATH . 'build/index.asset.php';

        wp_register_script( 'cinemarathons', CINEMARATHONS_URL . 'build/index.js', $assets['dependencies'] ?? [], $assets['version'] ?? $this->version, true);
    }

    /**
     * Register block editor styles.
     *
     * @since 1.0.0
     * @access private
     */
    private function register_block_editor_styles() {

        wp_register_style( 'cinemarathons', CINEMARATHONS_URL . 'build/index.css', [], $this->version, 'all' );
    }

    /**
     * Register plugin settings.
     * 
     * @since 1.0.0
     * @access public
     */
    public function register_settings() {

        $settings = get_option( 'cinemarathons_options' );

        register_setting( 'cinemarathons', 'cinemarathons_options' );

        add_settings_section( 'cinemarathons_options', __( 'General Settings', 'cinemarathons' ), '__return_null', 'cinemarathons' );

        add_settings_field(
            'supported_post_types',
            'Supported Post Types',
            function() use ($settings) {
                $post_types = get_post_types( [ 'public' => true ], 'objects' );
                $supported_post_types = $settings['supported_post_types'] ?? [ 'page' ];
                require_once CINEMARATHONS_PATH . 'templates/dashboard/settings/fields/post-types.php';
            },
            'cinemarathons',
            'cinemarathons_options'
        );

        add_settings_field(
            'hide_settings_page',
            'Hide Settings Page',
            function() use ($settings) {
                $post_types = get_post_types( [ 'public' => true ], 'objects' );
                $hide_settings_page = $settings['hide_settings_page'] ?? [ 'page' ];
                require_once CINEMARATHONS_PATH . 'templates/dashboard/settings/fields/hide-settings-page.php';
            },
            'cinemarathons',
            'cinemarathons_options'
        );
    }

    /**
     * Register plugin admin pages.
     * 
     * @since 1.0.0
     * @access public
     */
    public function register_admin_pages() {

        $settings = get_option( 'cinemarathons_options', [] );
        $parent_slug = '1' !== $settings['hide_settings_page'] ? 'options-general.php' : false;

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

        if ( ! function_exists( 'register_block_type' ) ) {
            return;
        }

        $blocks = [
            'cinemarathons/marathon' => \Cinemarathons\Blocks\Marathon::class,
            'cinemarathons/marathons' => \Cinemarathons\Blocks\Marathons::class,
        ];

        foreach ( $blocks as $slug => $block ) {
            $instance = new $block;
            register_block_type( $slug, [
                'api_version' => 2,
                'attributes' => $instance->attributes(),
                'render_callback' => [ $instance, 'render' ],
            ]);
        }
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
     * Handle inital installation and upgrading of the plugin.
     *
     * @since 1.0.0
     * @access public
     */
    public function activate() {

        $db_version = get_option( 'CINEMARATHONS_VERSION' );
        if ( version_compare( $db_version, $this->version ) ) {
            update_option( 'CINEMARATHONS_VERSION', $this->version );
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
