<?php
$items = \Cinemarathons\get_marathons( [
    'number' => $attributes['number'],
] );
?>
    <div <?php echo get_block_wrapper_attributes(); ?>>
<?php if ( 'list' === $attributes['mode'] ) : ?>
        <div class="marathons marathons-list">
<?php else : ?>
        <div class="marathons marathons-grid" data-grid-columns="<?php echo esc_attr( $attributes['columns'] ); ?>">
<?php
endif;

if ( count( $items ) ) :
    foreach ( $items as $item ) :
?>
            <div class="marathon"<?php echo 'grid' === $attributes['mode'] ? ' style="--marathon-featured-image:url(' . esc_url( $item['image'] ) . ')' : ''; ?>">
                <a href="<?php echo get_the_permalink( $item['id'] ); ?>">
                    <span class="title"><?php echo esc_html( $item['title'] ); ?></span>
                </a>
            </div>
<?php
    endforeach;
endif;
?>
        </div>
    </div>