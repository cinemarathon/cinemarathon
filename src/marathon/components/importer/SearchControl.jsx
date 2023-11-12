import { BaseControl, SelectControl, TextControl } from '@wordpress/components';
import { __ } from '@wordpress/i18n';

const SearchControl = ( {
	APIKEY,
	searchQuery,
	setSearchQuery,
	searchType,
	setSearchType,
} ) => {
	return (
		<BaseControl
			id="tmdb-search-form"
			className="search-form"
			label={ __( 'Search on TheMovieDB', 'cinemarathons' ) }
			help={
				! APIKEY
					? 'A valid TMDb API Key is required. You can get your key on themoviedb.org and set it in the API section of the Settings page.'
					: ''
			}
		>
			<TextControl
				className="search-query"
				placeholder={ __(
					'Search a movie, an actor, a director…',
					'cinemarathons'
				) }
				value={ searchQuery }
				onChange={ ( value ) => setSearchQuery( value ) }
			/>
			<SelectControl
				className="search-type"
				size="small"
				suffix=" "
				value={ searchType }
				options={ [
					{
						value: 'multi',
						label: __( 'All', 'cinemarathons' ),
						default: '',
					},
					{
						value: 'movie',
						label: __( 'Movie', 'cinemarathons' ),
						default: '',
					},
					{
						value: 'person',
						label: __( 'Person', 'cinemarathons' ),
						default: '',
					},
				] }
				onChange={ ( value ) => setSearchType( value ) }
				disabled={ ! APIKEY }
			/>
		</BaseControl>
	);
};

export default SearchControl;
