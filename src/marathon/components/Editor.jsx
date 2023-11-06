import {
    Button,
    Icon,
    ToggleControl,
	Tooltip
} from "@wordpress/components"
import { useState } from "@wordpress/element"
import { plus } from "@wordpress/icons"
import { __, _n } from "@wordpress/i18n"

import { Available, Bonus, Check, DoubleCheck } from "../../icons"

import BatchEditor from "./BatchEditor"
import ListEditor from "./ListEditor"

const Editor = ( { attributes, setAttributes, itemsHandler } ) => {

    const [advancedEditingMode, setAdvancedEditingMode] = useState( false )

    return (
        <div className="editor">
            <div className="editor-header">
                <div className="header-column column-watched check-column">
                    <Tooltip
                        delay={ 0 }
                        placement="left"
                        text={ __( "Just watched it!", "cinemarathon" ) }
                        onClick={ () => alert(':)') }
                    >
                        <div>
                            <Icon icon={ Check } />
                        </div>
                    </Tooltip>
                </div>
                <div className="header-column column-rewatch check-column">
                    <Tooltip
                        delay={ 0 }
                        placement="top"
                        text={ __( "Seen this one before", "cinemarathon" ) }
                    >
                        <div>
                            <Icon icon={ DoubleCheck } />
                        </div>
                    </Tooltip>
                </div>
                <div className="header-column column-available check-column">
                    <Tooltip
                        delay={ 0 }
                        placement="top"
                        text={ __( "I have this movie right here", "cinemarathon" ) }
                    >
                        <div>
                            <Icon icon={ Available } />
                        </div>
                    </Tooltip>
                </div>
                <div className="header-column column-bonus check-column">
                    <Tooltip
                        delay={ 0 }
                        placement="top"
                        text={ __( "Bonus movie, not mandatory to watch", "cinemarathon" ) }
                    >
                        <div>
                            <Icon icon={ Bonus } />
                        </div>
                    </Tooltip>
                </div>
                <div className="header-column column-title text-column">{ __( "Movie Title", "cinemarathon" ) }</div>
                <div className="header-column column-editing-mode">
                    <ToggleControl
                        label={ advancedEditingMode ? __( "Back to Easy Mode", "cinemarathon" ) : __( "Expert Mode", "cinemarathon" ) }
                        checked={ advancedEditingMode }
                        onChange={ () => setAdvancedEditingMode( ! advancedEditingMode ) }
                    />
                </div>
            </div>
            <div className="editor-content">
                {
                    advancedEditingMode
                        ? (
                            <BatchEditor
                                attributes={ attributes }
                                setAttributes={ setAttributes }
                            />
                        ) : (
                            <ListEditor
                                attributes={ attributes }
                                setAttributes={ setAttributes }
                                itemsHandler={ itemsHandler }
                            />
                        )
                }
            </div>
            <div className="editor-footer">
                <div className="footer-content">
                    { sprintf( _n( '%s Movie', '%s Movies', attributes.movies.length ), attributes.movies.length ) }
                </div>
                <div className="footer-actions">
                    { ! advancedEditingMode && (
                        <Button
                            className="add-new"
                            size="small"
                            variant="icon"
                            label={ __( "Add new movie", "cinemarathon" ) }
                            showTooltip={ true }
                            onClick={ itemsHandler.add }
                        >
                            <Icon
                                icon={ plus }
                                size={ 20 }
                            />
                        </Button>
                    ) }
                </div>
            </div>
        </div>
    )
}

export default Editor