import apiFetch from "@wordpress/api-fetch"
import {
	InspectorControls,
	MediaUpload,
	MediaUploadCheck
} from "@wordpress/block-editor"
import {
	BaseControl,
	Button,
	PanelBody,
    SelectControl,
	TextareaControl,
	TextControl,
    __experimentalHStack as HStack,
    __experimentalText as Text
} from "@wordpress/components"
import { useDebounce } from "@wordpress/compose"
import { useEffect, useState } from "@wordpress/element"
import { __ } from "@wordpress/i18n"

import { Movie, Person, TV } from "../icons"

const Settings = ( { attributes, setAttributes } ) => {

    const APIKEY = cinemarathons_options?.api?.tmdb_api_key ?? ''

	const [ image, setImage ] = useState( {} )
    const [ searchQuery, setSearchQuery ] = useState( "" )
    const [ searchResults, setSearchResults ] = useState( [] )
    const [ searchType, setSearchType ] = useState( "multi" )

    const searchOnTMDb = () => {
        if ( '' !== searchQuery ) {
            fetch( `https://api.themoviedb.org/3/search/${searchType}?api_key=${APIKEY}&query=${searchQuery}&include_adult=false&language=en-US&page=1` )
                .then( response => response.json()
                    .then( data => setSearchResults( _.sortBy( data.results, 'media_type' ) ) )
                )
        } else {
            setSearchResults( [] )
        }
    }

    const debouncedSearch = useDebounce( searchOnTMDb, 500 )

	useEffect( () => {
		if ( attributes.image ) {
			apiFetch( { path: `/wp/v2/media/${ attributes.image }` } ).then( response => {
				setImage( response )
			} )
		} else if ( 0 === attributes.image ) {
			setImage( {} )
		}
		return () => {}
	}, [ attributes.image ] )

    useEffect( () => {
        debouncedSearch()
        return () => {}
    }, [ searchQuery ] )

    useEffect( () => {
        searchOnTMDb()
        return () => {}
    }, [ searchType ] )

    console.log( searchType )

    return (
        <InspectorControls key="setting">
            <div className="cinemarathons-marathon-block-inspector">
                <PanelBody>
                    <BaseControl
                        className="search-form"
                        label={ __( "Search on TheMovieDB", "cinemarathons" ) }
                        help={ ! APIKEY ? "A valid TMDb API Key is required. You can get your key on themoviedb.org and set it in the API section of the Settings page." : "" }
                    >
                        <TextControl
                            className="search-query"
                            placeholder={ __( "Search a movie, an actor, a director...", "cinemarathons" ) }
                            value={ searchQuery }
                            onChange={ value => setSearchQuery( value ) }
                        />
                        <SelectControl
                            className="search-type"
                            size="small"
                            suffix=" "
                            value={ searchType }
                            options={ [
                                {
                                    value: "multi",
                                    label: __( "All", "cinemarathons" ),
                                    default: ""
                                },
                                {
                                    value: "movie",
                                    label: __( "Movie", "cinemarathons" ),
                                    default: ""
                                },
                                {
                                    value: "person",
                                    label: __( "Person", "cinemarathons" ),
                                    default: ""
                                },
                                {
                                    value: "tv",
                                    label: __( "TV", "cinemarathons" ),
                                    default: ""
                                },
                            ] }
                            onChange={ value => setSearchType( value ) }
                            disabled={ ! APIKEY }
                        />
                    </BaseControl>
                    { searchResults.length ? (
                        <ul className="search-results">
                            { searchResults.map( ( result, key ) => (
                                <li key={ key }>
                                    { ( 'person' === searchType || 'person' === result.media_type ) && (
                                        <Button
                                            key={ key }
                                            onClick={ () => console.log( result ) }
                                            icon={ Person }
                                        >
                                            <span className="name">{ result.name }</span>
                                            <span
                                                className="known-for"
                                                dangerouslySetInnerHTML={
                                                    { __html: sprintf(
                                                        __( "Known for <strong>%s</strong>, <em>%s</em>", "" ),
                                                        result.known_for_department,
                                                        _.pluck( result.known_for ?? [], 'title' ).join( '</em>, <em>' )
                                                    ) }
                                                }
                                            />
                                        </Button>
                                    ) }
                                    { ( 'movie' === searchType || 'movie' === result.media_type ) && (
                                        <Button
                                            key={ key }
                                            onClick={ () => console.log( result ) }
                                            icon={ Movie }
                                        >
                                            <span className="name">{ result.title }</span>
                                            <span
                                                className="details"
                                                dangerouslySetInnerHTML={
                                                    { __html: sprintf(
                                                        __( "<strong>%s</strong> – <em>%s</em>", "" ),
                                                        ( new Date( result.release_date ) ).getFullYear(),
                                                        ( result.genre_ids ?? [] ).join( '</em>, <em>' )
                                                    ) }
                                                }
                                            />
                                        </Button>
                                    ) }
                                    { ( 'tv' === searchType || 'tv' === result.media_type ) && (
                                        <Button
                                            key={ key }
                                            onClick={ () => console.log( result ) }
                                            icon={ TV }
                                        >
                                            <span className="name">{ result.title }</span>
                                            <span
                                                className="details"
                                                dangerouslySetInnerHTML={
                                                    { __html: sprintf(
                                                        __( "<strong>%s</strong> – <em>%s</em>", "" ),
                                                        ( new Date( result.release_date ) ).getFullYear(),
                                                        ( result.genre_ids ?? [] ).join( '</em>, <em>' )
                                                    ) }
                                                }
                                            />
                                        </Button>
                                    ) }
                                </li>
                            ) ) }
                        </ul>
                    ) : ( "" ) }
                </PanelBody>
                <PanelBody>
                    <TextControl
                        label={ __( "Title of the marathon", "cinemarathons" ) }
                        value={ attributes.title }
                        onChange={ value => setAttributes( { title: value } ) }
                    />
                    <BaseControl label={ __( "Featured image of the marathon", "cinemarathons" ) } >
                        <MediaUploadCheck>
                            <MediaUpload
                                allowedTypes={ [ 'image' ] }
                                onSelect={ ( image ) => setAttributes( { image: image.id } ) }
                                render={ ( { open } ) => (
                                    <div className="marathon-featured-image">
                                        <Button onClick={ open }>
                                            { attributes.image && image?.media_details?.sizes?.large?.source_url ? (
                                                <img className="marathon-featured-image__image" src={ image?.media_details?.sizes?.large?.source_url } alt="" />
                                            ) : (
                                                <Text className="marathon-featured-image__text">{ __( "Select Media", "cinemarathons" ) }</Text>
                                            ) }
                                        </Button>
                                        { attributes.image ? (
                                            <HStack className="marathon-featured-image__actions">
                                                <Button
                                                    onClick={ open }
                                                    variant="secondary"
                                                    text={ __( "Replace", "cinemarathons" ) }
                                                    className="marathon-featured-image__button marathon-featured-image__replace"
                                                />
                                                <Button
                                                    onClick={ () => setAttributes( { image: 0 } ) }
                                                    variant="secondary"
                                                    text={ __( "Remove", "cinemarathons" ) }
                                                    className="marathon-featured-image__button marathon-featured-image__remove"
                                                />
                                            </HStack>
                                        ) : ( '' ) }
                                    </div>
                                ) }
                            />
                        </MediaUploadCheck>
                    </BaseControl>
                    <TextareaControl
                        label={ __( "Description of the marathon", "cinemarathons" ) }
                        value={ attributes.description }
                        onChange={ value => setAttributes( { description: value } ) }
                    />
                    <TextareaControl
                        label={ __( "Objectives of the marathon", "cinemarathons" ) }
                        value={ attributes.objectives }
                        onChange={ value => setAttributes( { objectives: value } ) }
                    />
                    <TextareaControl
                        label={ __( "Comments", "cinemarathons" ) }
                        value={ attributes.comments }
                        onChange={ value => setAttributes( { comments: value } ) }
                    />
                </PanelBody>
            </div>
        </InspectorControls>
    )
}

export default Settings