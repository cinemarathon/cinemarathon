import {
	Button,
	CheckboxControl,
	Icon,
	TextControl,
    DropdownMenu,
    MenuGroup,
    MenuItem
} from "@wordpress/components"
import {
	arrowUp,
	arrowDown,
	copy,
	trash,
	moreVertical,
    dragHandle,
    chevronUp,
    chevronDown
} from "@wordpress/icons"
import { __ } from "@wordpress/i18n"
import { useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"

const ListItem = ( { itemsHandler, movie } ) => {

    const {
        index,
        isDragging,
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition
    } = useSortable( { id: movie.hash } )

    const style = {
        transition,
        transform: CSS.Transform.toString(transform)
    }

    return (
        <div
            id={ movie.hash }
            ref={ setNodeRef }
            style={ style }
            className={ `list-item ${ isDragging ? 'dragging' : '' }` }
        >
            <div className="list-item-column column-draghandle draghandle-column">
                <Button
                    {...listeners}
                    {...attributes}
                    size="small"
                    variant="icon"
                >
                    <Icon
                        icon={ dragHandle }
                        size={ 20 }
                    />
                </Button>
            </div>
            <div className="list-item-column column-watched check-column">
                <CheckboxControl
                    checked={ movie.watched }
                    onChange={ value => itemsHandler.update( index, 'watched', value ) }
                />
            </div>
            <div className="list-item-column column-rewatch check-column">
                <CheckboxControl
                    checked={ movie.rewatch }
                    onChange={ value => itemsHandler.update( index, 'rewatch', value ) }
                />
            </div>
            <div className="list-item-column column-available check-column">
                <CheckboxControl
                    checked={ movie.available }
                    onChange={ value => itemsHandler.update( index, 'available', value ) }
                />
            </div>
            <div className="list-item-column column-bonus check-column">
                <CheckboxControl
                    checked={ movie.bonus }
                    onChange={ value => itemsHandler.update( index, 'bonus', value ) }
                />
            </div>
            <div className="list-item-column column-title text-column">
                <TextControl
                    value={ movie.title }
                    onChange={ value => itemsHandler.update( index, 'title', value ) }
                />
            </div>
            <div className="list-item-column column-actions check-column">
                <DropdownMenu
                    icon={ moreVertical }
                    label="Select a direction."
                    children={ ( { onClose } ) => (
                        <>
                            <MenuGroup>
                                <MenuItem
                                    text={ __( "Duplicate Item", "cinemarathons" ) }
                                    icon={ copy }
                                    iconPosition="right"
                                    onClick={ () => {
                                        itemsHandler.duplicate( index )
                                        onClose()
                                    } }
                                />
                            </MenuGroup>
                            <MenuGroup>
                                <MenuItem
                                    text={ __( "Move Item to Top", "cinemarathons" ) }
                                    icon={ arrowUp }
                                    iconPosition="right"
                                    onClick={ () => {
                                        itemsHandler.moveTop( index )
                                        onClose()
                                    } }
                                />
                                <MenuItem
                                    text={ __( "Move Item Up", "cinemarathons" ) }
                                    icon={ chevronUp }
                                    iconPosition="right"
                                    onClick={ () => {
                                        itemsHandler.moveUp( index )
                                        onClose()
                                    } }
                                />
                                <MenuItem
                                    text={ __( "Move Item Down", "cinemarathons" ) }
                                    icon={ chevronDown }
                                    iconPosition="right"
                                    onClick={ () => {
                                        itemsHandler.moveDown( index )
                                        onClose()
                                    } }
                                />
                                <MenuItem
                                    text={ __( "Move Item to Bottom", "cinemarathons" ) }
                                    icon={ arrowDown }
                                    iconPosition="right"
                                    onClick={ () => {
                                        itemsHandler.moveBottom( index )
                                        onClose()
                                    } }
                                />
                            </MenuGroup>
                            <MenuGroup>
                                <MenuItem
                                    text={ __( "Remove Item", "cinemarathons" ) }
                                    icon={ trash }
                                    iconPosition="right"
                                    onClick={ () => {
                                        itemsHandler.remove( index )
                                        onClose()
                                    } }
                                />
                            </MenuGroup>
                        </>
                    ) }
                />
            </div>
        </div>
    )
}

export default ListItem