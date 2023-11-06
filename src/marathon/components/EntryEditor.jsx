import {
	Button,
    Panel,
    PanelBody,
    PanelRow,
    SelectControl,
    TextareaControl,
	TextControl,
    TimePicker,
} from "@wordpress/components"
import { dispatch, useSelect } from "@wordpress/data"
import { useEffect, useState } from "@wordpress/element"

import { __ } from "@wordpress/i18n"

import TaxonomySelector from "./TaxonomySelector"

const showNotice = ( { message, type = 'success', actions = [] } ) =>
    dispatch( "core/notices" ).createNotice( type, message, {
        type: "snackbar",
        isDismissible: true,
        actions: actions,
    } )

const EntryEditor = ( { entry, setEntry, closeModal } ) => {

    const [ categories, setCategories ] = useState( [] )
    const [ tags, setTags ] = useState( [] )

    /**
     * All formats sorted alphabetically by translated name.
     * @link https://github.com/WordPress/gutenberg/blob/trunk/packages/editor/src/components/post-format/index.js#L17
     */
    const formats = [
        { value: 'aside', label: __( 'Aside' ) },
        { value: 'audio', label: __( 'Audio' ) },
        { value: 'chat', label: __( 'Chat' ) },
        { value: 'gallery', label: __( 'Gallery' ) },
        { value: 'image', label: __( 'Image' ) },
        { value: 'link', label: __( 'Link' ) },
        { value: 'quote', label: __( 'Quote' ) },
        { value: 'standard', label: __( 'Standard' ) },
        { value: 'status', label: __( 'Status' ) },
        { value: 'video', label: __( 'Video' ) },
    ].sort( ( a, b ) => {
        const normalizedA = a.label.toUpperCase()
        const normalizedB = b.label.toUpperCase()
        if ( normalizedA < normalizedB ) {
            return -1
        }
        if ( normalizedA > normalizedB ) {
            return 1
        }
        return 0
    } )

    const posts = useSelect( select =>
        select( "core" ).getEntityRecords( "postType", "post", {
            status: "publish",
        } )
    )

    const publish = async () => {
        dispatch( "core" ).saveEntityRecord(
                "postType",
                "post",
                {
                    title: entry.title,
                    content: entry.content,
                    format: entry.format,
                    status: "publish",
                    categories: entry.categories,
                    tags: entry.tags,
                },
                {
                    throwOnError: true
                }
            )
            .then( response => {
                showNotice( {
                    message: "Journal Entry published successfully. Don't forget to save your post!",
                    actions: [
                        {
                            onClick: () => wp.data.dispatch( 'core/editor' ).savePost(),
                            label: __( "Save Post" ),
                        }
                    ]
                } )
                setEntry( { ...entry, id: response.id } )
                closeModal()
            } )
            .catch( error => {
                showNotice( {
                    message: `An error occurred: ${ error.message }`,
                    type: "error"
                } )
            } )
    }

    useEffect( () => {
        setEntry( { ...entry, categories: categories.map( category => category.id ) } )
        return () => {}
    }, [ categories ] )

    useEffect( () => {
        setEntry( { ...entry, tags: tags.map( tag => tag.id ) } )
        return () => {}
    }, [ tags ] )

    return (
        <>
            <TextControl
                label={ __( "Entry Title", "cinemarathons" ) }
                value={ entry.title }
                onChange={ value => setEntry( { ...entry, title: value } ) }
            />
            <TextareaControl
                label={ __( "Entry Content", "cinemarathons" ) }
                value={ entry.content }
                onChange={ value => setEntry( { ...entry, content: value } ) }
            />
            <Panel>
                <PanelBody
                    title={ __( "Advanced Options", "cinemarathons" ) }
                    initialOpen={ false }
                >
                    <PanelRow>
                        <SelectControl
                            label={ __( "Post Format" ) }
                            value={ entry.format }
                            options={ formats }
                            onChange={ value => setEntry( { ...entry, format: value } ) }
                        />
                    </PanelRow>
                    <PanelRow>
                        <TaxonomySelector
                            label={ __( "Categories" ) }
                            taxonomy="category"
                            values={ categories.map( category => category.name ) }
                            onChange={ values => setCategories( values ) }
                        />
                    </PanelRow>
                    <PanelRow>
                        <TaxonomySelector
                            label={ __( "Tags" ) }
                            taxonomy="post_tag"
                            values={ tags.map( tag => tag.name ) }
                            onChange={ values => setTags( values ) }
                        />
                    </PanelRow>
                    <PanelRow>
                        <TimePicker
                            currentTime={ new Date() }
                            onChange={ value => console.log( value ) }
                            is12Hour={ false }
                        />
                    </PanelRow>
                </PanelBody>
            </Panel>
            <Button
                text={ __( "Publish Entry", "cinemarathons" ) }
                variant="primary"
                onClick={ publish }
                className="submit-button"
            />
        </>
    )
}

export default EntryEditor