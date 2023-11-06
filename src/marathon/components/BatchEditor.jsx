import {
	Button,
	TextareaControl,
	__experimentalText as Text
} from "@wordpress/components"
import { useEffect, useState } from "@wordpress/element"
import { __ } from "@wordpress/i18n"

const BatchEditor = ( { attributes, setAttributes, itemsHandler } ) => {

	const [ batchList, setBatchList ] = useState( "" )
    const [ batchEditorHeight, setbatchEditorHeight ] = useState( 200 )

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
		if ( "" !== batchList ) {
			const rows = batchList.match(/\n/g)?.length ?? 4
			if ( rows ) {
				setbatchEditorHeight( Math.max( 80, rows * 24 ) )
                console.log( rows, Math.round( rows * 24 ) )
			}
		}
		return () => {}
	}, [ batchList ] )

    return (
        <div className="batch-editor">
            <TextareaControl
                style={ { height: `${ batchEditorHeight }px` } }
                value={ batchList }
                onChange={ value => setBatchList( value ) }
            />
            <div className="actions">
                <Text>
                    { __( "Type in a list of movies to add, one per line", "cinemarathon" ) }
                </Text>
                <Button
                    size="small"
                    variant="primary"
                    text={ __( "Add movies", "cinemarathon" ) }
                    onClick={ batch }
                />
            </div>
        </div>
    )
}

export default BatchEditor