    <select name="cinemarathons_options[journal][default_date]">
<?php foreach ( $dates as $key => $name ) : ?>
        <option value="<?php echo esc_attr( $key ); ?>" <?php selected( $key, $default_date ); ?>/> <?php esc_html_e( $name ); ?></option>
<?php endforeach; ?>
    </select>
    <p class="description"><small><?php _e( 'You can define a default date for new "journal" entries. If no default date is set the plugin will use the current date. You can always edit this before publishing, or later if needed.', 'cinemarathons' ) ?></small></p>