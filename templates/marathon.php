
    <div class="wp-block-cinemarathon-marathon">
        <h1 class="wp-block-heading"><?php the_title(); ?></h1>
        <h2 class="wp-block-heading"><?php _e( 'Full List', 'cinemarathon' ); ?></h2>
        <ul>
<?php foreach ( $attributes['movies'] as $movie ) : ?>
            <li>
                <?php echo $movie['watched'] ? '🟢' : ( $movie['rewatch'] ? '🟠' : '🔴' ); ?>
                &nbsp;&ndash;&nbsp;
                <?php echo $movie['available'] ? '📀' : '💸'; ?>
                &nbsp;&ndash;&nbsp;
                <?php echo esc_html( $movie['title'] ); ?>
            </li>
<?php endforeach; ?>
        </ul>
    </div>