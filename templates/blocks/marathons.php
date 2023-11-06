<?php if ( 'list' === $block->attributes['mode'] ) : ?>
    <div class="wp-block-cinemarathons-marathons mode-list">
<?php else : ?>
    <div class="wp-block-cinemarathons-marathons mode-grid" data-grid-columns="<?php echo esc_attr( $block->attributes['columns'] ); ?>">
<?php
endif;

if ( count( $block->data['items'] ) ) :
    foreach ( $block->data['items'] as $item ) :
?>
        <div class="marathon"<?php echo 'grid' === $block->attributes['mode'] ? ' style="--marathon-featured-image:url(' . esc_url( $item['image'] ) . ')' : ''; ?>">
            <a href="<?php echo get_the_permalink( $item['id'] ); ?>">
                <span class="title"><?php echo esc_html( $item['title'] ); ?></span>
            </a>
        </div>
<?php
    endforeach;
endif;
?>
    </div>