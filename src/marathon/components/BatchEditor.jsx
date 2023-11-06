import {
	Button,
	TextareaControl,
	__experimentalText as Text
} from "@wordpress/components"
import { useEffect, useRef, useState } from "@wordpress/element"
import { __ } from "@wordpress/i18n"

const BatchEditor = ( { attributes, setAttributes, itemsHandler } ) => {

    const editorRef = useRef( null )

	const [ batchList, setBatchList ] = useState( "" )

	const batch = () => {
		setAttributes( {
            movies: [
                ...attributes.movies,
                ...batchList.split("\n").map( item => ( {
                    ...itemsHandler.defaultItem(),
                    title: item
                } ) )
            ]
        } )
		setBatchList( "" )
	}

    useEffect( () => {
        const editor = editorRef.current.querySelector( 'textarea' )
        editor.style.height = 0
        editor.style.height = editor.scrollHeight + 2 + 'px'
        return () => {}
    }, [ batchList ] )

    useEffect( () => {
        let list = []
        attributes.movies.map( movie => list.push( movie.title ) )
        setBatchList( list.join( "\n" ) )
        return () => {}
    }, [] )

    return (
        <div className="batch-editor">
            <div
                ref={ editorRef }
                className="batch-editor-wrapper"
            >
                <TextareaControl
                    rows={ 1 }
                    value={ batchList }
                    onChange={ value => setBatchList( value ) }
                />
            </div>
            <div className="actions">
                <Text>
                    { __( "Type in a list of movies to add, one per line", "cinemarathon" ) }
                </Text>
                <Button
                    size="small"
                    variant="primary"
                    text={ __( "Update", "cinemarathon" ) }
                    onClick={ batch }
                />
            </div>
        </div>
    )
}

export default BatchEditor