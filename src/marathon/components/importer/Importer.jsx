import { useDebounce } from '@wordpress/compose';
import { useEffect, useState } from '@wordpress/element';

import _ from 'underscore';

import SearchControl from './SearchControl';
import SearchResults from './SearchResults';
import ImporterModal from './ImporterModal';

const Importer = ( { itemsHandler } ) => {
	const APIKEY = window.cinemarathonsOptions?.api?.tmdb_api_key ?? '';
	const LOCALE = window.cinemarathonsOptions?.locale ?? 'en-US';

	const [ showModal, setShowModal ] = useState( false );

	const closeModal = () => setShowModal( false );
	const openModal = () => setShowModal( true );
	const [ searchPerson, setSearchPerson ] = useState( [] );
	const [ searchQuery, setSearchQuery ] = useState( '' );
	const [ searchResults, setSearchResults ] = useState( [] );
	const [ searchType, setSearchType ] = useState( 'multi' );

	const [ credits, setCredits ] = useState( {} );

	const [ jobsList, setJobsList ] = useState( [] );

	const [ genresList, setGenresList ] = useState(
		JSON.parse( window.localStorage.getItem( 'tmdbGenres' ) ?? '{}' )
	);

	const loadGenresList = async () => {
		const genres = {
			movie: [],
			tv: [],
		};
		await fetch(
			`https://api.themoviedb.org/3/genre/movie/list?api_key=${ APIKEY }`
		).then( ( response ) =>
			response
				.json()
				.then( ( data ) => ( genres.movie = data.genres ?? [] ) )
		);
		await fetch(
			`https://api.themoviedb.org/3/genre/tv/list?api_key=${ APIKEY }`
		).then( ( response ) =>
			response
				.json()
				.then( ( data ) => ( genres.tv = data.genres ?? [] ) )
		);
		setGenresList( genres );
	};

	const loadCombinedCredits = () => {
		if ( searchPerson.id ) {
			fetch(
				`https://api.themoviedb.org/3/person/${ searchPerson.id }/combined_credits?api_key=${ APIKEY }&language=${ LOCALE }`
			)
				.then( ( response ) => response.json() )
				.then( ( data ) => setCredits( data ) );
		}
	};

	const searchOnTMDb = () => {
		if ( '' !== searchQuery ) {
			fetch(
				`https://api.themoviedb.org/3/search/${ searchType }?api_key=${ APIKEY }&query=${ searchQuery }&include_adult=false&language=${ LOCALE }&page=1`
			).then( ( response ) =>
				response
					.json()
					.then( ( data ) =>
						setSearchResults(
							_.sortBy( data.results, 'media_type' )
						)
					)
			);
		} else {
			setSearchResults( [] );
		}
	};

	const debouncedSearch = useDebounce( searchOnTMDb, 500 );

	useEffect( () => {
		debouncedSearch();
		return () => {};
	}, [ searchQuery ] );

	useEffect( () => {
		searchOnTMDb();
		return () => {};
	}, [ searchType ] );

	useEffect( () => {
		if ( searchPerson.id ) {
			loadCombinedCredits();
		}
		return () => {};
	}, [ searchPerson ] );

	useEffect( () => {
		setJobsList( _.unique( _.pluck( credits.crew, 'job' ) ).sort() );
		return () => {};
	}, [ credits ] );

	useEffect( () => {
		loadGenresList();
		return () => {};
	}, [] );

	return (
		<>
			<SearchControl
				APIKEY={ APIKEY }
				searchQuery={ searchQuery }
				setSearchQuery={ setSearchQuery }
				searchType={ searchType }
				setSearchType={ setSearchType }
			/>
			{ searchResults.length ? (
				<SearchResults
					results={ searchResults }
					type={ searchType }
					genresList={ genresList }
					setSearchPerson={ setSearchPerson }
					setSearchQuery={ setSearchQuery }
					setSearchResults={ setSearchResults }
					openModal={ openModal }
					itemsHandler={ itemsHandler }
				/>
			) : (
				''
			) }
			{ showModal && (
				<ImporterModal
					credits={ credits }
					genresList={ genresList }
					jobsList={ jobsList }
					searchPerson={ searchPerson }
					closeModal={ closeModal }
					itemsHandler={ itemsHandler }
				/>
			) }
		</>
	);
};

export default Importer;
