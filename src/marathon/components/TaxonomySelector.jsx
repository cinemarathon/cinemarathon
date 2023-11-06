/**
 * Taxonomy Selector based on Gutenberg Category Selector Component.
 * 
 * @link https://github.com/WordPress/gutenberg/blob/trunk/packages/patterns/src/components/category-selector.js
 */
import { FormTokenField } from "@wordpress/components"
import { useDebounce } from "@wordpress/compose"
import { store as coreStore } from "@wordpress/core-data"
import { useSelect } from "@wordpress/data";
import { useMemo, useState } from "@wordpress/element"
import { decodeEntities } from "@wordpress/html-entities"

import { __ } from "@wordpress/i18n"

export default function TaxonomySelector( { taxonomy, label, values, onChange } ) {

	const [ search, setSearch ] = useState( '' )

	const debouncedSearch = useDebounce( setSearch, 500 )

	const { searchResults } = useSelect(
		( select ) => {
			const { getEntityRecords } = select( coreStore )

			return {
				searchResults: !! search
					? getEntityRecords( 'taxonomy', taxonomy, {
							per_page: 20,
							_fields: 'id,name',
							context: 'view',
							search,
					  } )
					: [],
			}
		},
		[ search ]
	)

	const suggestions = useMemo( () => {
		return ( searchResults ?? [] )
			.map( term => decodeEntities( term.name ) )
	}, [ searchResults ] )

	const handleChange = ( termNames ) => {
		const uniqueTerms = termNames.reduce( ( terms, newTerm ) => {
			if (
				! terms.some(
					( term ) => term.toLowerCase() === newTerm.toLowerCase()
				)
			) {
				terms.push( newTerm )
			}
			return terms
		}, [] )

		onChange( uniqueTerms )
	}

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
	)
}