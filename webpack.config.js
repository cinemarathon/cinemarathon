const defaultConfig = require( '@wordpress/scripts/config/webpack.config.js' );

if ( process.env.NODE_ENV !== 'production' ) {
	defaultConfig.devServer.allowedHosts = [
		'www.wpmovielibrary.local',
		'www.cinemarathons.local',
		'localhost',
		'127.0.0.1',
	];
}

module.exports = defaultConfig;
