
    <div class="wp-block-cinemarathon-marathons <?php echo 'list' === $attributes['mode'] ? 'mode-list' : 'mode-grid'; ?>">
<?php
if ( count( $items ) ) : 
    foreach ( $items as $post_id ) :
?>
        <div class="marathon">
            <a href="<?php echo get_the_permalink( $post_id ); ?>"><?php echo get_the_title( $post_id ); ?></a>
        </div>
<?php
    endforeach;
endif;
?>
    </div>