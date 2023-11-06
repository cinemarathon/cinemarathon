<?php foreach ( $tags as $id => $name ) : ?>
    <label><input type="checkbox" name="cinemarathons_options[journal][default_tags][]" value="<?php echo esc_attr( $id ); ?>" <?php checked( in_array( $id, $default_tags, true ) ); ?>/> <?php esc_html_e( $name ); ?></label><br />
<?php endforeach; ?>
    <p class="description"><small><?php _e( 'Cinemarathons will automatically add the selected tags to each new journale entry. You can still remove them before creating posts if you set the publication mode to manual. <em>Default is none</em>.', 'cinemarathons' ); ?></small></p>