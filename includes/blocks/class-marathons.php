<?php
/**
 * The file that defines the plugin marathons block class.
 *
 * @link https://wordpress.org/plugins/cinemarathon
 * @package Cinemarathon
 */

namespace Cinemarathon\Blocks;

use Cinemarathon\Core\Block;

use function Cinemarathon\match_blocks_recursive;

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

        $settings = get_option( 'cinemarathon_options', [] );

        // Prepare supported post types for query.
        $supported_post_types = array_map( function( $supported_post_type ) use ($wpdb) {
            return $wpdb->prepare( "post_type = '%s'", $supported_post_type );
        }, $settings['supported_post_types'] ?? [ 'page' ] );
        $condition = implode( ' OR ', $supported_post_types );

        $query = "SELECT ID, post_title, post_content FROM {$wpdb->posts} WHERE ( {$condition} ) AND post_status = 'publish' AND post_content LIKE '%s' LIMIT 0, %d";
        $posts = $wpdb->get_results( $wpdb->prepare( $query, '% wp:cinemarathon/marathon {%', $this->attributes['number'] ) );

        $items = [];
        foreach ( $posts as $post ) {
            // Parse post content.
            $blocks = parse_blocks( $post->post_content );

            // Retrieve marathon blocks.
            $matches = match_blocks_recursive( 'cinemarathon/marathon', $blocks );

            foreach ( $matches as $block ) {

                if ( empty( $block['attrs'] ) ) {
                    continue;
                }

                // Default data.
                $item = [
                    'id' => $post->ID,
                    'title' => $post->post_title,
                    'image' => CINEMARATHON_URL . 'assets/images/default-image.jpg',
                    'url' => get_the_permalink( $post->ID ),
                    'current' => 0,
                    'total' => 0,
                    'progress' => 0,
                ];

                // Use block's title if one is set.
                if ( ! empty( $block['attrs']['title'] ) ) {
                    $item['title'] = $block['attrs']['title'];
                }

                // Add block ID to the URL, if any.
                if ( ! empty( $block['attrs']['id'] ) ) {
                    $item['url'] .= '#' . $block['attrs']['id'];
                }

                // Use block's image if one is set.
                if ( ! empty( $block['attrs']['image'] ) ) {
                    $item['image'] = wp_get_attachment_image_url( (int) $block['attrs']['image'], 'large' );
                }

                // Calculate some data about the marathon.
                if ( ! empty( $block['attrs']['movies'] ) ) {
                    $item['current'] = count( wp_filter_object_list( $block['attrs']['movies'], [ 'watched' => 1 ] ) );
                    $item['total'] = count( $block['attrs']['movies'] );
                    $item['progress'] = round( ( $item['current'] / $item['total'] ) * 100 );
                }

                $items[] = $item;
            }
        }

        $this->data['items'] = $items;
    }

}