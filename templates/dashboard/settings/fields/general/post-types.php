<?php foreach ( $post_types as $post_type ) : ?>
    <label><input type="checkbox" name="cinemarathons_options[general][supported_post_types][]" value="<?php echo esc_attr( $post_type->name ); ?>" <?php checked( in_array( $post_type->name, $supported_post_types, true ) ); ?>/> <?php esc_html_e( $post_type->label ); ?></label><br />
<?php endforeach; ?>
    <p class="description"><small><?php _e( 'Cinemarathons will automatically discover the marathons included in the selected post types. <em>Default is Pages</em>.', 'cinemarathons' ); ?></small></p>