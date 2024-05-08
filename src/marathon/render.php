<?php
$data = [
    'image' => CINEMARATHONS_URL . 'assets/images/default-image.jpg',
    'current' => 0,
    'total' => 0,
    'progress' => 0,
];

if ( ! empty( $attributes['image'] ) ) {
    $data['image'] = wp_get_attachment_image_url( (int) $attributes['image'], 'original' );
}

if ( ! empty( $attributes['movies'] ) ) {
    $data['current'] = count( wp_filter_object_list( $attributes['movies'] ?? [], [ 'watched' => 1 ] ) );
    $data['rewatch'] = count( wp_filter_object_list( $attributes['movies'] ?? [], [ 'rewatch' => 1 ] ) );
    $data['total'] = count( $attributes['movies'] );
    $data['progress'] = round( ( $data['current'] / $data['total'] ) * 100 );
}

$data['bonuses'] = wp_filter_object_list( $attributes['movies'] ?? [], [ 'bonus' => 1 ] );
$data['movies'] = wp_filter_object_list( $attributes['movies'] ?? [], [ 'bonus' => 0 ] );
?>
    <div <?php echo get_block_wrapper_attributes( [ 'id' => $attributes['anchor'] ?? $attributes['id'] ?? '' ] ); ?>>
        <div class="marathon-header">
            <img src="<?php echo esc_url( $data['image'] ); ?>" alt="<?php echo esc_html( $attributes['title'] ); ?>">
            <h2><?php echo esc_html( $attributes['title'] ); ?></h2>
        </div>
        <div class="marathon-content">
            <div class="marathon-description">
                <h3><?php _e( 'Description', 'cinemarathons' ); ?></h3>
                <?php echo wpautop( esc_html( $attributes['description'] ) ); ?>
            </div>
            <div class="marathon-objectives">
                <h3><?php _e( 'Objectives', 'cinemarathons' ); ?></h3>
                <?php echo wpautop( esc_html( $attributes['objectives'] ) ); ?>
            </div>
            <div class="marathon-legend">
                <h4><?php _e( 'Legend', 'cinemarathons' ); ?></h4>
                <ul>
                    <li><?php /* translators: %s: emoji */ printf( __( '%s: Seen this one before, to be watched again', 'cinemarathons' ), '🟠' ); ?></li>
                    <li><?php /* translators: %s: emoji */ printf( __( '%s: Not watched (yet)!', 'cinemarathons' ), '🔴' ); ?></li>
                    <li><?php /* translators: %s: emoji */ printf( __( '%s: Watched!', 'cinemarathons' ), '🟢' ); ?></li>
                    <li><?php /* translators: %s: emoji */ printf( __( '%s: Available for watching', 'cinemarathons' ), '📀' ); ?></li>
                    <li><?php /* translators: %s: emoji */ printf( __( '%s: Unavailable for watching', 'cinemarathons' ), '💸' ); ?></li>
                </ul>
            </div>
            <div class="marathon-items">
                <h3><?php _e( 'Full List', 'cinemarathons' ); ?></h3>
                <ul>
<?php foreach ( $data['movies'] as $movie ) : ?>
                    <li>
                        <?php echo $movie['watched'] ? '🟢' : ( $movie['rewatch'] ? '🟠' : '🔴' ); ?>
                        &nbsp;&ndash;&nbsp;
                        <?php echo $movie['available'] ? '📀' : '💸'; ?>
                        &nbsp;&ndash;&nbsp;
<?php if ( ! empty( $movie['post_id'] ) ) : ?>
                        <a href="<?php echo esc_html( get_permalink( $movie['post_id'] ) ); ?>"><?php echo esc_html( $movie['title'] ); ?></a>
<?php else : ?>
                        <?php echo esc_html( $movie['title'] ); ?>
<?php endif; ?>
                    </li>
<?php endforeach; ?>
                </ul>
            </div>
            <div class="marathon-bonus">
                <h3><?php _e( 'Bonus List', 'cinemarathons' ); ?></h3>
                <ul>
<?php foreach ( $data['bonuses'] as $movie ) : ?>
                    <li>
                        <?php echo $movie['watched'] ? '🟢' : ( $movie['rewatch'] ? '🟠' : '🔴' ); ?>
                        &nbsp;&ndash;&nbsp;
                        <?php echo $movie['available'] ? '📀' : '💸'; ?>
                        &nbsp;&ndash;&nbsp;
<?php if ( ! empty( $movie['post_id'] ) ) : ?>
                        <a href="<?php echo esc_html( get_permalink( $movie['post_id'] ) ); ?>"><?php echo esc_html( $movie['title'] ); ?></a>
<?php else : ?>
                        <?php echo esc_html( $movie['title'] ); ?>
<?php endif; ?>
                    </li>
<?php endforeach; ?>
                </ul>
            </div>
            <div class="marathon-comments">
                <h3><?php _e( 'Comments', 'cinemarathons' ); ?></h3>
                <?php echo wpautop( esc_html( $attributes['comments'] ) ); ?>
            </div>
        </div>
    </div>