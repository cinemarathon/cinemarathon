<?php

namespace Cinemarathon;

/**
 * Match blocks recursively.
 * 
 * @since 1.0
 * 
 * @param  string $content
 * @return array
 */
function match_block_recursive( $block_name, $blocks = [] ) {

    foreach ( $blocks as $block ) {
        if ( $block_name === $block['blockName'] ) {
            return $block;
        }
        if ( ! empty( $block['innerBlocks'] ) ) {
            return match_block_recursive( $block_name, $block['innerBlocks'] );
        }
    }

    return [];
}