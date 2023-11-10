/**
 * Taxonomy Selector based on Gutenberg Category Selector Component.
 *
 * @link https://github.com/WordPress/gutenberg/blob/trunk/packages/patterns/src/components/category-selector.js
 */
import { FormTokenField } from '@wordpress/components';
import { useDebounce } from '@wordpress/compose';
import { store as coreStore } from '@wordpress/core-data';
import { useSelect } from '@wordpress/data';
import { useMemo, useState } from '@wordpress/element';
import { decodeEntities } from '@wordpress/html-entities';

import { __ } from '@wordpress/i18n';

export default function TermSelector( {
	taxonomy,
	label,
	values,
	onChange,
} ) {
	const [ search, setSearch ] = useState( '' );
	const [ suggestedTerms, setSuggestedTerms ] = useState( [] );

	const debouncedSearch = useDebounce( setSearch, 500 );

	const { searchResults } = useSelect(
		( select ) => {
			let searchResults = [];
			if ( search ) {
				searchResults =
					select( coreStore ).getEntityRecords(
						'taxonomy',
						taxonomy,
						{
							per_page: 20,
							_fields: 'id,name',
							context: 'view',
							search,
						}
					) ?? [];
				setSuggestedTerms( [ ...suggestedTerms, ...searchResults ] );
			}
			return { searchResults };
		},
		[ search ]
	);

	const suggestions = useMemo( () => {
		return ( searchResults ?? [] ).map( ( term ) =>
			decodeEntities( term.name )
		);
	}, [ searchResults ] );

	const handleChange = ( termNames ) => {
		const uniqueTerms = termNames.reduce( ( terms, newTerm ) => {
			if (
				! terms.some(
					( term ) =>
						term.name.toLowerCase() === newTerm.toLowerCase()
				)
			) {
				const term = ( suggestedTerms ?? [] )
					.filter( ( term ) => newTerm === term.name )
					.pop();
				if ( term ) {
					terms.push( term );
				}
			}
			return terms;
		}, [] );
		onChange( uniqueTerms );
	};

	return (
		<>
			<FormTokenField
				value={ values }
				suggestions={ suggestions }
				onChange={ handleChange }
				onInputChange={ debouncedSearch }
				maxSuggestions={ 20 }
				label={ label }
				tokenizeOnBlur={ true }
			/>
		</>
	);
}
