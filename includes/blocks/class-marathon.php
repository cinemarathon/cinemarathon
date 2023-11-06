<?php
/**
 * The file that defines the plugin marathon block class.
 *
 * @link https://wordpress.org/plugins/cinemarathon
 * @package Cinemarathon
 */

namespace Cinemarathon\Blocks;

use Cinemarathon\Core\Block;

/**
 * Define the marathon block class.
 *
 * @since 1.0
 * @author Charlie Merland <charlie@caercam.org>
 */
class Marathon extends Block {

    /**
     * @var string
     */
    protected $template = 'marathon';

    /**
	 * Prepare block before build.
	 *
	 * @since 1.0
     * @access public
	 */
    public function prepare() {

        $this->data = [
            'image' => CINEMARATHON_URL . 'assets/images/default-image.jpg',
            'current' => 0,
            'total' => 0,
            'progress' => 0,
        ];

        if ( ! empty( $this->attributes['image'] ) ) {
            $this->data['image'] = wp_get_attachment_image_url( (int) $this->attributes['image'], 'original' );
        }

        if ( ! empty( $this->attributes['movies'] ) ) {
            $this->data['current'] = count( wp_filter_object_list( $this->attributes['movies'], [ 'watched' => 1 ] ) );
            $this->data['total'] = count( $this->attributes['movies'] );
            $this->data['progress'] = round( ( $this->data['current'] / $this->data['total'] ) * 100 );
        }

        $this->data['bonuses'] = wp_filter_object_list( $this->attributes['movies'], [ 'bonus' => 1 ] );
        $this->data['movies'] = array_values( array_diff_assoc( $this->attributes['movies'], $this->data['bonuses'] ) );
    }

}