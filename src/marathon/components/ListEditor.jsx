import {
	Button,
	__experimentalText as Text,
} from "@wordpress/components"
import { __ } from "@wordpress/i18n"

import ListItem from "./ListItem"

const ListEditor = ( { attributes, itemsHandler } ) => {

    return (
        <>
            { attributes.movies.length ? attributes.movies.map( ( movie, index ) => (
                <ListItem
                    key={ index }
                    index={ index }
                    movie={ movie }
                    itemsHandler={ itemsHandler }
                />
            ) ) : (
                <div className="placeholder">
                    <Text>{ __( "This marathon does not have any movie yet.", "cinemarathon" ) }</Text>
                    <Button
                        variant="link"
                        onClick={ itemsHandler.add }
                    >
                        { __( "Start by adding one!", "cinemarathon" ) }
                    </Button>
                </div>
            ) }
        </>
    )
}

export default ListEditor