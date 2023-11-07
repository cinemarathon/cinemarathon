<?php

return [
    'general' => [
        'supported_post_types' => [ 'page' ],
        'disable_journal_mode' => false,
        'hide_settings_page' => false,
    ],
    'journal' => [
        'default_title' => '%title%',
        'default_format' => 'status',
        'default_date' => 'today',
        'default_time' => '',
        'default_categories' => [],
        'default_tags' => [],
        'default_content' => __( 'Been watching <em>%title%</em>', 'cinemarathons' ),
    ],
    'api' => [
        'tmdb_api_key' => '',
    ]
];