<?php
/**
 * The file that defines the plugin block class.
 *
 * @link https://cinemarathons.com
 * @package Cinemarathons
 */

namespace Cinemarathons\Core;

/**
 * Define the block class.
 *
 * @since 1.0
 * @author Charlie Merland <charlie@caercam.org>
 */
abstract class Block {

    /**
     * The block attributes.
     *
     * @since 1.0
     * @access protected
     * @var array
     */
    protected $attributes = [];

    /**
     * Name of the block's Twig template file.
     *
     * @since 1.0
     * @access protected
     * @var string
     */
    protected $template;

    /**
     * The block template data.
     *
     * @since 1.0
     * @access protected
     * @var array
     */
    protected $data = [];

    /**
     * The block's rendered content.
     *
     * @since 1.0
     * @access protected
     * @var string
     */
    protected $content;

	/**
	 * Construct.
	 *
	 * @since 1.0
	 * @access public
	 */
	final public function __construct() {

		$this->init();
	}

	/**
	 * Specific block setup.
	 *
	 * @since 1.0
	 * @access protected
	 */
	protected function init() {}

    /**
     * Prepare block before build.
     *
     * @since 1.0
     * @access protected
     */
    abstract protected function prepare();

    /**
     * Retrieve the block attributes.
     *
     * @since 1.0
     * @access public
     * 
     * @return array
     */
    final public function attributes() {

        return $this->attributes;
    }

    /**
     * Build the block content.
     * 
     * @since 1.0
     * @access protected
     */
    protected function build() {

        $this->prepare();

        $template_path = get_theme_file_path( "cinemarathons/blocks/{$this->template}.php" );
        if ( ! file_exists( $template_path ) ) {
            $template_path = CINEMARATHONS_PATH . "templates/blocks/{$this->template}.php";
            if ( ! file_exists( $template_path ) ) {
                return $this->content;
            }
        }

        ob_start();

        $block = $this;        

        require $template_path;

        $this->content = ob_get_clean();
    }

    /**
     * Render the block.
     * 
     * @since 1.0
     * @access public
     * 
     * @param  array  $attributes
     * @param  stirng $content
     * @return string
     */
    final public function render( array $attributes = [], $content = null ) {

        $this->attributes = (array) $attributes;
        $this->content = (string) $content;

        $this->build();

        return $this->content;
    }
}
