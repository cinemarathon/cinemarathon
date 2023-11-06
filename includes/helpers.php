<?php

namespace Cinemarathons;

/**
 * Match blocks recursively.
 * 
 * @since 1.0
 * 
 * @param  string $content
 * @return array
 */
function match_blocks_recursive( $block_name, $blocks = [], &$matches = [] ) {

    foreach ( $blocks as $block ) {
        if ( $block_name === $block['blockName'] ) {
            $matches[] = $block;
        } elseif ( ! empty( $block['innerBlocks'] ) ) {
            $matches = match_blocks_recursive( $block_name, $block['innerBlocks'], $matches );
        }
    }

    return $matches;
}