import {
	Button,
	TextareaControl,
	ToggleControl,
    __experimentalHStack as HStack,
} from "@wordpress/components"
import { useEffect, useRef, useState } from "@wordpress/element"
import { __ } from "@wordpress/i18n"

const BatchEditor = ( { attributes, setAttributes, itemsHandler, setAdvancedEditingMode } ) => {

    const editorRef = useRef( null )

	const [ batchList, setBatchList ] = useState( "" )
    const [ mergeMode, setMergeMode ] = useState( false )

    const parseList = () => batchList.split("\n").map( line => {
        let matches = [ ...line.matchAll( /^(\[([01,]+)\])?\ ?(.*?)$/gm ) ].pop(),
              title = matches.pop(),
             checks = [ "watched", "rewatch", "available", "bonus" ],
             values = [],
               item = {}
        if ( matches[2] ) {
            values = matches[2].split( "," )
            checks.map( check => item[ check ] = "1" === values.shift() )
        }
        return {
            ...itemsHandler.defaultItem(),
            ...item,
            title: title,
            hash: itemsHandler.generateHash( title )
        }
    } )

	const update = () => {
        setAttributes( {
            movies: mergeMode ? [
                ...attributes.movies,
                ...parseList()
            ] : [
                ...parseList()
            ]
        } )
	}

    useEffect( () => {
        const editor = editorRef.current.querySelector( 'textarea' )
        editor.style.height = 0
        editor.style.height = editor.scrollHeight + 2 + 'px'
        return () => {}
    }, [ batchList ] )

    useEffect( () => {
        let list = []
        attributes.movies.map( movie => {
            let checks = [ "watched", "rewatch", "available", "bonus" ],
                values = []
            checks.map( check => values.push( movie[ check ] ? 1 : 0 ) )
            list.push( "" !== movie.title ? `[${ values.join( "," ) }] ${ movie.title }` : "" )
         } )
        setBatchList( list.join( "\n" ) )
        return () => {}
    }, [] )

    return (
        <div className="batch-editor">
            <div
                className="batch-editor-notice"
                dangerouslySetInnerHTML={ { __html: __( "Use the textarea below to input a list of movies to add to your marathon, one per line. <strong>Be careful!</strong> This will completely replace your current list, <strong>all unsaved changes will be lost!</strong> If you're not sure what you are doing, or you change want to add some new movies to your list, just input the new movies and make sure to check the \"Merge\" toggle next to the \"Update\" button.", "cinemarathons" ) } }
            />
            <div
                ref={ editorRef }
                className="batch-editor-wrapper"
                data-title={ __( "Ex: [0,1,1,0] 1968 − The Good, the Bad and the Ugly", "cinemarathons" ) }
            >
                <TextareaControl
                    rows={ 1 }
                    value={ batchList }
                    onChange={ value => setBatchList( value ) }
                />
            </div>
            <div className="actions">
                <HStack justify="flex-end">
                    <ToggleControl
                        label={ __( "Merge", "cinemarathons" ) }
                        help={ __( "Merge the above list with the current list instead of replacing it", "cinemarathons" ) }
                        checked={ mergeMode }
                        onChange={ () => setMergeMode( ! mergeMode ) }
                        className="is-reverse is-small"
                        __nextHasNoMarginBottom={ true }
                    />
                    <Button
                        variant="primary"
                        text={ __( "Update", "cinemarathons" ) }
                        onClick={ () => {
                            update()
                            setAdvancedEditingMode( false )
                        } }
                    />
                </HStack>
            </div>
        </div>
    )
}

export default BatchEditor