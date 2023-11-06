import { Button, __experimentalText as Text } from "@wordpress/components"
import { useMemo } from "@wordpress/element"
import { __ } from "@wordpress/i18n"

import { DndContext, closestCenter } from "@dnd-kit/core"

import ListItem from "./ListItem"
import { SortableContext, arrayMove, verticalListSortingStrategy } from "@dnd-kit/sortable"

const ListEditor = ( { attributes, setAttributes, itemsHandler } ) => {

    const onDragEnd = event => {
        const { active, over } = event
        if ( active.id !== over.id ) {
            setAttributes( {
                movies: [
                    ...arrayMove(
                        attributes.movies,
                        items.indexOf( active.id ),
                        items.indexOf( over.id)
                    )
                ]
            } )
        }
    }

    const items = useMemo( () => attributes.movies.map( movie => movie.hash, [ attributes.movies ] ) )

    return (
        <>
            { attributes.movies.length ? (
                <DndContext
                    autoScroll={ true }
                    collisionDetection={ closestCenter }
                    onDragEnd={ onDragEnd }
                >
                    <SortableContext
                        items={ items }
                        strategy={ verticalListSortingStrategy }
                    >
                        { attributes.movies.map( ( movie ) => (
                            <ListItem
                                key={ movie.hash }
                                movie={ movie }
                                itemsHandler={ itemsHandler }
                            />
                        ) ) }
                    </SortableContext>
                </DndContext>
            ) : (
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