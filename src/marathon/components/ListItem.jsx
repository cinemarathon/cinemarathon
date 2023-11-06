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

const ListItem = ( { index, itemsHandler, movie } ) => {

    return (
        <div className="list-item" key={ index } id={ movie.hash }>
            <div className="list-item-column column-draghandle draghandle-column">
                <Button
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
                                    text={ __( "Duplicate Item", "cinemarathon" ) }
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
                                    text={ __( "Move Item to Top", "cinemarathon" ) }
                                    icon={ arrowUp }
                                    iconPosition="right"
                                    onClick={ () => {
                                        itemsHandler.moveBottom( index )
                                        onClose()
                                    } }
                                />
                                <MenuItem
                                    text={ __( "Move Item Up", "cinemarathon" ) }
                                    icon={ chevronUp }
                                    iconPosition="right"
                                    onClick={ () => {
                                        itemsHandler.moveUp( index )
                                        onClose()
                                    } }
                                />
                                <MenuItem
                                    text={ __( "Move Item Down", "cinemarathon" ) }
                                    icon={ chevronDown }
                                    iconPosition="right"
                                    onClick={ () => {
                                        itemsHandler.moveDown( index )
                                        onClose()
                                    } }
                                />
                                <MenuItem
                                    text={ __( "Move Item to Bottom", "cinemarathon" ) }
                                    icon={ arrowDown }
                                    iconPosition="right"
                                    onClick={ () => {
                                        itemsHandler.moveTop( index )
                                        onClose()
                                    } }
                                />
                            </MenuGroup>
                            <MenuGroup>
                                <MenuItem
                                    text={ __( "Remove Item", "cinemarathon" ) }
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