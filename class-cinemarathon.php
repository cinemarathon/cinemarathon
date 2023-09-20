<?php

/**
 * The file that defines the core plugin class.
 *
 * @link https://wordpress.org/plugins/cinemarathon
 * @package Cinemarathon
 */

namespace Cinemarathon;

/**
 * Define the main plugin class.
 *
 * @since 1.0.0
 * @author Charlie Merland <charlie@caercam.org>
 */
final class Cinemarathon {

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
     * Static class instance.
     * @var static
     */
    private static $instance;

    /**
     * Get the instance of this class, insantiating it if it doesn't exist yet.
     *
     * @since 1.0.0
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

    /**
     * Constructor.
     *
     * @since 1.0.0
     * @access private
     */
    private function __construct() {

        $this->version = CINEMARATHON_VERSION;

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
        add_action( 'cinemarathon/run', [ $this, 'translate' ] );

        // Let's get to work.
        add_action( 'cinemarathon/run', [ $this, 'storyboard' ] );
        add_action( 'cinemarathon/run', [ $this, 'rehearsal' ] );
        add_action( 'cinemarathon/run', [ $this, 'background' ] );
        add_action( 'cinemarathon/run', [ $this, 'foreground' ] );

        // Plugin activation hook.
        register_activation_hook( CINEMARATHON_PATH, [ $this, 'activate' ] );
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

        // Nothing to do here. Yet.

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

        add_action( 'admin_enqueue_scripts', [ $this, 'enqueue_admin_styles' ] );
        add_action( 'admin_enqueue_scripts', [ $this, 'enqueue_admin_scripts' ] );
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

        wp_enqueue_style( 'cinemarathon' );
    }

    /**
     * Register public-side styles.
     *
     * @since 1.0.0
     * @access private
     */
    private function register_scripts() {

        //
    }

    /**
     * Register public-side scripts.
     *
     * @since 1.0.0
     * @access private
     */
    private function register_styles() {

        wp_register_style( 'cinemarathon', CINEMARATHON_URL . 'build/style-index.css', [], CINEMARATHON_VERSION, 'all' );
    }

    /**
     * Enqueue admin-side scripts.
     *
     * @since 1.0.0
     * @access public
     *
     * @param string $hook_suffix The current admin page.
     */
    public function enqueue_admin_styles( $hook_suffix ) {

        $this->register_admin_styles();

        wp_enqueue_style( 'cinemarathon' );
    }

    /**
     * Enqueue admin-side styles.
     *
     * @since 1.0.0
     * @access public
     *
     * @param string $hook_suffix The current admin page.
     */
    public function enqueue_admin_scripts( $hook_suffix ) {

        $this->register_admin_scripts();

        wp_enqueue_script( 'cinemarathon' );
    }

    /**
     * Register admin-side scripts.
     *
     * @since 1.0.0
     * @access private
     */
    private function register_admin_styles() {

        wp_register_style( 'cinemarathon', CINEMARATHON_URL . 'build/index.css', [], $this->version, 'all' );
    }

    /**
     * Register admin-side styles.
     *
     * @since 1.0.0
     * @access private
     */
    private function register_admin_scripts() {

        wp_register_script( 'cinemarathon', CINEMARATHON_URL . 'build/index.js', [], $this->version, true);
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

        register_block_type( 'cinemarathon/marathon', [
            'api_version' => 2,
            'attributes' => [
                'movies' => [
                    'type' => 'array',
                    'default' => [],
                ],
            ],
            'render_callback' => function( $attributes = [], $content = null ) {

                ob_start();
                require CINEMARATHON_PATH . 'templates/marathon.php';
                $content = ob_get_clean();

                return $content;
            }
        ]);

        register_block_type( 'cinemarathon/marathons', [
            'api_version' => 2,
            'attributes' => [
                'number' => [
                    'type' => 'integer',
                    'default' => 6,
                ],
            ],
            'render_callback' => function( $attributes = [], $content = null ) {

                global $wpdb;

                $items = $wpdb->get_col(
                    $wpdb->prepare(
                        "SELECT ID FROM {$wpdb->posts} WHERE post_type IN ( 'page', 'post' ) AND post_status = 'publish' AND post_content LIKE '%s'",
                        '% wp:cinemarathon/marathon {%'
                    )
                );

                ob_start();
                require CINEMARATHON_PATH . 'templates/marathons.php';
                $content = ob_get_clean();

                return $content;
            }
        ]);
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
                    'slug' => 'cinemarathon',
                    'title' => 'Cinemarathon',
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

        $db_version = get_option( 'CINEMARATHON_VERSION' );
        if ( version_compare( $db_version, $this->version ) ) {
            update_option( 'CINEMARATHON_VERSION', $this->version );
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
        do_action_ref_array( 'cinemarathon/run', [ $this ] );
    }
}

/**
 * The main function responsible for returning the one true plugin Instance
 * to functions everywhere.
 *
 * Use this function like you would a global variable, except without needing
 * to declare the global.
 *
 * Example: <?php $cinemarathon = cinemarathon(); ?>
 *
 * @since 1.0
 *
 * @return Cinemarathon The one true Cinemarathon Instance
 */
function cinemarathon() {
    return Cinemarathon::instance();
}
