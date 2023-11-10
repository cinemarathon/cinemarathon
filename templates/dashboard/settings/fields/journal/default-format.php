    <select name="cinemarathons_options[journal][default_format]">
<?php foreach ( $post_formats as $post_format ) : ?>
        <option value="<?php echo esc_attr( $post_format ); ?>" <?php selected( $post_format, $default_format ); ?>><?php echo esc_html( get_post_format_string( $post_format ) ); ?></option>
<?php endforeach; ?>
    </select>
    <p class="description"><small><?php _e( 'Cinemarathons will automatically add the selected post format to each new journal entry. You can still change it before creating posts if you set the publication mode to manual. <em>Default is \'status\'</em>.', 'cinemarathons' ); ?></small></p>