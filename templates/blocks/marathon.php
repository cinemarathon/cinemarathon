
    <div id="<?php echo esc_attr( $block->attributes['id'] ); ?>" class="wp-block-cinemarathons-marathon">
        <div class="marathon-header">
            <img src="<?php echo esc_url( $block->data['image'] ); ?>" alt="<?php echo esc_html( $block->attributes['title'] ); ?>">
            <h2><?php echo esc_html( $block->attributes['title'] ); ?></h2>
        </div>
        <div class="marathon-content">
            <div class="marathon-description">
                <h3><?php _e( 'Description', 'cinemarathons' ); ?></h3>
                <?php echo wpautop( esc_html( $block->attributes['description'] ) ); ?>
            </div>
            <div class="marathon-objectives">
                <h3><?php _e( 'Objectives', 'cinemarathons' ); ?></h3>
                <?php echo wpautop( esc_html( $block->attributes['objectives'] ) ); ?>
            </div>
            <div class="marathon-legend">
                <h4><?php _e( 'Legend', 'cinemarathons' ); ?></h4>
                <ul>
                    <li><?php printf( __( '%s: Seen this one before, to be watched again', 'cinemarathons' ), '🟠' ); ?></li>
                    <li><?php printf( __( '%s: Not watched (yet)!', 'cinemarathons' ), '🔴' ); ?></li>
                    <li><?php printf( __( '%s: Watched!', 'cinemarathons' ), '🟢' ); ?></li>
                    <li><?php printf( __( '%s: Available for watching', 'cinemarathons' ), '📀' ); ?></li>
                    <li><?php printf( __( '%s: Unavailable for watching', 'cinemarathons' ), '💸' ); ?></li>
                </ul>
            </div>
            <div class="marathon-items">
                <h3><?php _e( 'Full List', 'cinemarathons' ); ?></h3>
                <ul>
<?php foreach ( $block->data['movies'] as $movie ) : ?>
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
            <div class="marathon-bonus">
                <h3><?php _e( 'Bonus List', 'cinemarathons' ); ?></h3>
                <ul>
<?php foreach ( $block->data['bonuses'] as $movie ) : ?>
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
                <h3><?php _e( 'Comments', 'cinemarathons' ); ?></h3>
                <?php echo wpautop( esc_html( $block->attributes['comments'] ) ); ?>
            </div>
        </div>
    </div>