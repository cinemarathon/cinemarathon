const { __ } = wp.i18n;

document
	.querySelector( '[data-action="test-tmdb-api-key"]' )
	?.addEventListener( 'click', ( event ) => {
		event.preventDefault();
		const key = document.querySelector(
			'[name="cinemarathons_options[api][tmdb_api_key]"]'
		)?.value;
		if ( key ) {
			fetch(
				`https://api.themoviedb.org/3/configuration?api_key=${ key }`
			).then( ( response ) => {
				const result = document.querySelector( '#tmdb-api-key-test' );
				if ( 200 === response.status ) {
					result.innerText = __(
						'The API Key is valid!',
						'cinemarathons'
					);
					result.style.color = 'green';
				} else {
					result.innerText = __(
						'The API key seems to be invalid!',
						'cinemarathons'
					);
					result.style.color = 'red';
				}
			} );
		}
	} );
