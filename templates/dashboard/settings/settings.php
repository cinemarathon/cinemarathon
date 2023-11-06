
    <div class="wrap">
		<h1><?php echo esc_html( get_admin_page_title() ); ?></h1>
		<form class="settings-form" action="options.php" method="post">
<?php settings_fields( 'cinemarathon' ); ?>
<?php do_settings_sections( 'cinemarathon' ); ?>
<?php submit_button( __( 'Save Settings' ) ); ?>
		</form>
	</div>
