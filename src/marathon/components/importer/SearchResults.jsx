import { Button } from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import { Movie, Person } from '../../icons';

import _ from 'underscore';

const SearchResult = ( { type, result, genresList, handleClick } ) => {
	const icons = {
		movie: <Movie />,
		person: <Person />,
	};

	const genres = _.filter(
		( result.genre_ids ?? [] ).map(
			( id ) => _.findWhere( genresList.movie ?? [], { id } ) ?? {}
		)
	);

	const details = () => {
		if ( 'movie' === type || 'movie' === result.media_type ) {
			return (
				<span>
					<strong>
						{ result.release_date
							? new Date( result.release_date ).getFullYear()
							: '?' }
					</strong>
					&nbsp;−&nbsp;
					{ _.pluck( genres, 'name' ).map( ( genre, key ) => (
						<em key={ key }>{ genre }</em>
					) ) }
				</span>
			);
		} else if ( 'person' === type || 'person' === result.media_type ) {
			return (
				<span>
					{ __( 'Known for', 'cinemarathons' ) }{ ' ' }
					<strong>{ result.known_for_department }</strong>,{ ' ' }
					{ _.pluck( result.known_for ?? [], 'title' ).map(
						( job, key ) => (
							<em key={ key }>{ job }</em>
						)
					) }
				</span>
			);
		}
	};

	return (
		<Button
			onClick={ handleClick }
			icon={
				'multi' === type ? icons[ result.media_type ] : icons[ type ]
			}
		>
			<span className="title">{ result.title ?? result.name ?? '' }</span>
			<span className="details">{ details() }</span>
		</Button>
	);
};

const SearchResults = ( {
	results,
	type,
	genresList,
	setSearchPerson,
	setSearchQuery,
	setSearchResults,
	openModal,
	itemsHandler,
} ) => {
	const handleClick = ( result ) => {
		if ( 'movie' === result.media_type ) {
			itemsHandler.add( [
				{
					title: result.title,
					tmdb_id: result.id,
				},
			] );
			setSearchQuery( '' );
			setSearchResults( [] );
		} else if ( 'person' === result.media_type ) {
			setSearchPerson( result );
			openModal();
		}
	};

	return (
		<ul className="search-results">
			{ results.map( ( result, key ) => (
				<li key={ key }>
					<SearchResult
						type={ type }
						result={ result }
						genresList={ genresList }
						handleClick={ () => handleClick( result ) }
					/>
				</li>
			) ) }
		</ul>
	);
};

export default SearchResults;
