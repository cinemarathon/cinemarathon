import {
	Button,
	CheckboxControl,
	Icon,
    Modal,
	TextControl,
    DropdownMenu,
    MenuGroup,
    MenuItem
} from "@wordpress/components"
import { useEffect, useState } from "@wordpress/element"
import {
	arrowUp,
	arrowDown,
	copy,
	trash,
	moreVertical,
    dragHandle,
    chevronUp,
    chevronDown,
    post,
    customLink,
    external
} from "@wordpress/icons"

import { __ } from "@wordpress/i18n"

import { useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"

import EntryEditor from "./EntryEditor"
import EntrySelector from "./EntrySelector"

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

    const [ showEntrySelectionModal, setShowEntrySelectionModal ] = useState( false )
    const [ showEntryPublicationModal, setShowEntryPublicationModal ] = useState( false )

    const closePublicationModal = () => setShowEntryPublicationModal( false )
    const openPublicationModal = () => setShowEntryPublicationModal( true )

    const closeSelectionModal = () => setShowEntrySelectionModal( false )
    const openSelectionModal = () => setShowEntrySelectionModal( true )

    const [ entry, setEntry ] = useState( {
        id: movie.post_id ?? 0,
        title: movie.title ?? '',
        content: `A vu <em>${ movie.title }</em>`,
        date: "",
        time: "",
        format: "status",
        categories: [],
        tags: [],
    } )

    const [ title, setTitle ] = useState( movie.title )

    useEffect( () => {
        itemsHandler.update( index, 'post_id', entry.id )
        return () => {}
    }, [ entry.id ] )

    return (
        <>
            <div
                id={ movie.hash }
                ref={ setNodeRef }
                style={ {
                    transition,
                    transform: CSS.Transform.toString(transform)
                } }
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
                        value={ title }
                        onChange={ setTitle }
                        onBlur={ () => itemsHandler.update( index, 'title', title ) }
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
                                    { movie.post_id ? (
                                        <>
                                            <MenuItem
                                                text={ __( "View journal entry", "cinemarathons" ) }
                                                icon={ external }
                                                iconPosition="right"
                                                href={ `/?p=${ movie.post_id }` }
                                                target="_blank"
                                                onClick={ onClose }
                                            />
                                            <MenuItem
                                                text={ __( "Replace journal entry", "cinemarathons" ) }
                                                icon={ post }
                                                iconPosition="right"
                                                onClick={ () => {
                                                    openSelectionModal()
                                                    onClose()
                                                } }
                                            />
                                        </>
                                    ) : (
                                        <>
                                            <MenuItem
                                                text={ __( "Publish journal entry", "cinemarathons" ) }
                                                icon={ post }
                                                iconPosition="right"
                                                onClick={ () => {
                                                    openPublicationModal()
                                                    onClose()
                                                } }
                                            />
                                            <MenuItem
                                                text={ __( "Select existing entry", "cinemarathons" ) }
                                                icon={ customLink }
                                                iconPosition="right"
                                                onClick={ () => {
                                                    openSelectionModal()
                                                    onClose()
                                                } }
                                            />
                                        </>
                                    )}
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
            { showEntryPublicationModal && (
                <Modal
                    title={ __( "Publish a new Journal Entry", "cinemarathons" ) }
                    onRequestClose={ closePublicationModal }
                    className="entry-publication-modal"
                >
                    <EntryEditor
                        entry={ entry }
                        setEntry={ setEntry }
                        closeModal={ closePublicationModal }
                    />
                </Modal>
            ) }
            { showEntrySelectionModal && (
                <Modal
                    title={ movie.post_id
                        ? __( "Select a different Post as Journal Entry", "cinemarathons" )
                        : __( "Select a Post as Journal Entry", "cinemarathons" )
                    }
                    onRequestClose={ closeSelectionModal }
                    className="entry-selection-modal"
                >
                    <EntrySelector
                        entry={ entry }
                        setEntry={ setEntry }
                        closeModal={ closeSelectionModal }
                    />
                </Modal>
            ) }
        </>
    )
}

export default ListItem