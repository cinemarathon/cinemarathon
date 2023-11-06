<?php foreach ( $post_types as $post_type ) : ?>
    <label><input type="checkbox" name="cinemarathon_options[supported_post_types][]" value="<?php echo esc_attr( $post_type->name ); ?>" <?php checked( in_array( $post_type->name, $supported_post_types, true ) ); ?>/> <?php esc_html_e( $post_type->label ); ?></label><br />
<?php endforeach; ?>
    <p class="description"><small><?php _e( 'Cinemarathon will automatically discover the marathons included in the selected post types. <em>Default is Pages</em>.', 'cinemarathon' ); ?></small></p>