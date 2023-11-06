<?php
/**
 * The file that defines the plugin marathons block class.
 *
 * @link https://wordpress.org/plugins/cinemarathon
 * @package Cinemarathon
 */

namespace Cinemarathon\Blocks;

use Cinemarathon\Core\Block;

use function Cinemarathon\match_block_recursive;
use function Cinemarathon\parse_blocks_recursive;

/**
 * Define the marathons block class.
 *
 * @since 1.0
 * @author Charlie Merland <charlie@caercam.org>
 */
class Marathons extends Block {

    /**
     * @var array
     */
    protected $attributes = [
        'number' => [
            'type' => 'integer',
            'default' => 6,
        ],
        'mode' => [
            'type' => 'string',
            'default' => 'grid',
        ],
        'columns' => [
            'type' => 'integer',
            'default' => 2,
        ],
    ];

    /**
     * @var string
     */
    protected $template = 'marathons';

    /**
	 * Prepare block before build.
	 *
	 * @since 1.0
     * @access public
	 */
    public function prepare() {

        global $wpdb;

        $posts = $wpdb->get_results(
            $wpdb->prepare(
                "SELECT ID, post_content FROM {$wpdb->posts} WHERE post_type IN ( 'page', 'post' ) AND post_status = 'publish' AND post_content LIKE '%s'",
                '% wp:cinemarathon/marathon {%'
            )
        );

        $items = [];
        foreach ( $posts as $post ) {

            $blocks = parse_blocks( $post->post_content );

            $block = match_block_recursive( 'cinemarathon/marathon', $blocks );
            if ( empty( $block ) || empty( $block['attrs'] ) ) {
                continue;
            }

            $item = [
                'id' => $post->ID,
                'image' => CINEMARATHON_URL . 'assets/images/default-image.jpg',
                'current' => 0,
                'total' => 0,
                'progress' => 0,
            ];

            if ( ! empty( $block['attrs']['image'] ) ) {
                $item['image'] = wp_get_attachment_image_url( (int) $block['attrs']['image'], 'large' );
            }

            if ( ! empty( $block['attrs']['movies'] ) ) {
                $item['current'] = count( wp_filter_object_list( $block['attrs']['movies'], [ 'watched' => 1 ] ) );
                $item['total'] = count( $block['attrs']['movies'] );
                $item['progress'] = round( ( $item['current'] / $item['total'] ) * 100 );
            }

            $items[] = $item;
        }

        $this->data['items'] = $items;
    }

}