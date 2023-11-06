
    <div class="wp-block-cinemarathon-marathon">
        <div class="marathon-header">
            <img src="<?php echo esc_url( $block->data['image'] ); ?>" alt="<?php echo esc_html( $block->attributes['title'] ); ?>">
            <h2><?php echo esc_html( $block->attributes['title'] ); ?></h2>
        </div>
        <div class="marathon-content">
            <div class="marathon-description">
                <h3><?php _e( 'Description', 'cinemarathon' ); ?></h3>
                <?php echo wpautop( esc_html( $block->attributes['description'] ) ); ?>
            </div>
            <div class="marathon-objectives">
                <h3><?php _e( 'Objectives', 'cinemarathon' ); ?></h3>
                <?php echo wpautop( esc_html( $block->attributes['objectives'] ) ); ?>
            </div>
            <div class="marathon-legend">
                <h4><?php _e( 'Legend', 'cinemarathon' ); ?></h4>
                <ul>
                    <li><?php printf( __( '%s: Seen this one before, to be watched again', 'cinemarathon' ), '🟠' ); ?></li>
                    <li><?php printf( __( '%s: Not watched (yet)!', 'cinemarathon' ), '🔴' ); ?></li>
                    <li><?php printf( __( '%s: Watched!', 'cinemarathon' ), '🟢' ); ?></li>
                    <li><?php printf( __( '%s: Available for watching', 'cinemarathon' ), '📀' ); ?></li>
                    <li><?php printf( __( '%s: Unavailable for watching', 'cinemarathon' ), '💸' ); ?></li>
                </ul>
            </div>
            <div class="marathon-items">
                <h3><?php _e( 'Full List', 'cinemarathon' ); ?></h3>
                <ul>
<?php foreach ( $block->attributes['movies'] as $movie ) : ?>
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
            <div class="marathon-comments">
                <h3><?php _e( 'Comments', 'cinemarathon' ); ?></h3>
                <?php echo wpautop( esc_html( $block->attributes['comments'] ) ); ?>
            </div>
        </div>
    </div>