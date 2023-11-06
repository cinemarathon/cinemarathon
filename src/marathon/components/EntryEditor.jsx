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
import { useState } from "@wordpress/element"

import { __ } from "@wordpress/i18n"

import TaxonomySelector from "./TaxonomySelector"

const EntryEditor = ( { movie, closeModal } ) => {

    const [ entry, setEntry ] = useState( {
        title: movie.title,
        content: `A vu <em>${ movie.title }</em>`,
        date: "",
        time: "",
        format: "status",
        categories: [ "Cinema" ],
        tags: [ "Movie", "Foo" ],
    } )

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
        select( 'core' ).getEntityRecords( 'postType', 'post', {
            status: 'publish',
        } )
    )

    const publish = () => {
        dispatch( "core/notices" ).createNotice(
            "success",
            "Journal Entry published successfully!",
            {
                type: "snackbar",
                isDismissible: true,
                actions: [
                    {
                        url: '#',
                        label: 'View post',
                    },
                ],
            }
        )
        closeModal()
    }

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
                            values={ entry.categories }
                            onChange={ values => setEntry( { ...entry, categories: values } ) }
                        />
                    </PanelRow>
                    <PanelRow>
                        <TaxonomySelector
                            label={ __( "Tags" ) }
                            taxonomy="post_tag"
                            values={ entry.tags }
                            onChange={ values => setEntry( { ...entry, tags: values } ) }
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
            />
        </>
    )
}

export default EntryEditor