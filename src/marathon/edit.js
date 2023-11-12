import { InspectorControls, useBlockProps } from '@wordpress/block-editor';
import { Placeholder } from '@wordpress/components';
import { useEffect } from '@wordpress/element';
import { __ } from '@wordpress/i18n';

import hash from 'object-hash';

import { Cinemarathon } from './icons';

import BlockControls from './components/BlockControls';
import Editor from './components/Editor';

import './editor.scss';

const Edit = ( { attributes, setAttributes } ) => {
	const blockProps = useBlockProps();

	const generateHash = ( value = '' ) =>
		hash.MD5( value + '-' + Math.random().toString( 36 ) );

	const defaultItem = () => ( {
		watched: false,
		rewatch: false,
		available: false,
		bonus: false,
		title: '',
		tmdb_id: '',
	} );

	const add = ( items = [] ) => {
		let movies = [];
		if ( items.length ) {
			movies = items.map( ( item ) => {
				return {
					...defaultItem(),
					...item,
					hash: generateHash( item.title ?? '' ),
				};
			} );
		} else {
			movies.push( {
				...defaultItem(),
				hash: generateHash(),
			} );
		}
		setAttributes( { movies: [ ...attributes.movies, ...movies ] } );
	};

	const remove = ( index ) => {
		const movies = [ ...attributes.movies ];
		movies.splice( index, 1 );
		setAttributes( { movies } );
	};

	const update = ( index, key, value ) => {
		const movies = [ ...attributes.movies ];
		movies[ index ][ key ] = value;
		if ( 'title' === key ) {
			movies[ index ].hash = generateHash(
				'' !== value ? `${ value }-${ index }` : value
			);
		}
		setAttributes( { movies } );
	};

	const move = ( index, destination ) => {
		const movies = [ ...attributes.movies ];
		if (
			index < 0 ||
			index >= movies.length ||
			destination < 0 ||
			destination >= movies.length
		) {
			return;
		}
		movies.splice( destination, 0, movies.splice( index, 1 ).pop() );
		setAttributes( { movies } );
	};

	const moveDown = ( index ) => move( index, index + 1 );

	const moveUp = ( index ) => move( index, index - 1 );

	const moveTop = ( index ) => move( index, 0 );

	const moveBottom = ( index ) => move( index, attributes.movies.length - 1 );

	const duplicate = ( index ) =>
		setAttributes( {
			movies: [
				...attributes.movies,
				{
					...attributes.movies[ index ],
				},
			],
		} );

	const itemsHandler = {
		generateHash,
		defaultItem,
		add,
		update,
		remove,
		move,
		moveDown,
		moveUp,
		moveTop,
		moveBottom,
		duplicate,
	};

	useEffect( () => {
		const movies = [];
		attributes.movies.map( ( movie, index ) =>
			movies.push( {
				...movie,
				hash: generateHash(
					'' !== movie.title ? `${ movie.title }-${ index }` : ''
				),
			} )
		);
		setAttributes( { movies: [ ...movies ] } );
		return () => {};
	}, [] );

	useEffect( () => {
		if ( ! attributes.id ) {
			setAttributes( { id: Date.now() } );
		}
		return () => {};
	}, [] );

	return (
		<div { ...blockProps }>
			<Placeholder
				icon={ Cinemarathon }
				label={
					'' !== attributes.title
						? attributes.title
						: __( 'Cinemarathon', 'cinemarathons' )
				}
				instructions={ __(
					'Use this block to display and manage a marathon. Add and sort movies, keep track of you current position, and have fun watching awesome movies!',
					'cinemarathons'
				) }
			>
				<Editor
					attributes={ attributes }
					setAttributes={ setAttributes }
					itemsHandler={ itemsHandler }
				/>
			</Placeholder>
			<InspectorControls key="setting">
				<BlockControls
					attributes={ attributes }
					setAttributes={ setAttributes }
					itemsHandler={ itemsHandler }
				/>
			</InspectorControls>
		</div>
	);
};

export default Edit;
