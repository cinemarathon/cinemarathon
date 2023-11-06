import apiFetch from "@wordpress/api-fetch"
import {
	InspectorControls,
	MediaUpload,
	MediaUploadCheck
} from "@wordpress/block-editor"
import {
	BaseControl,
	Button,
	PanelBody,
	TextareaControl,
	TextControl
} from "@wordpress/components"
import { useEffect, useState } from "@wordpress/element"
import { __ } from "@wordpress/i18n"

const Settings = ( { attributes, setAttributes } ) => {

	const [ image, setImage ] = useState( {} )

	useEffect( () => {
		if ( attributes.image ) {
			apiFetch( { path: `/wp/v2/media/${ attributes.image }` } ).then( response => {
				setImage( response )
			} )
		} else if ( 0 === attributes.image ) {
			setImage( {} )
		}
		return () => {}
	}, [ attributes.image ] )

    return (
        <InspectorControls key="setting">
            <div className="cinemarathon-marathon-block-inspector">
                <PanelBody>
                    <TextControl
                        label={ __( "Title of the marathon", "cinemarathon" ) }
                        value={ attributes.title }
                        onChange={ value => setAttributes( { title: value } ) }
                    />
                    <BaseControl label={ __( "Featured image of the marathon", "cinemarathon" ) } >
                        <MediaUploadCheck>
                            <MediaUpload
                                allowedTypes={ [ 'image' ] }
                                onSelect={ ( image ) => setAttributes( { image: image.id } ) }
                                render={ ( { open } ) => (
                                    <div className="media-uploader">
                                        { attributes.image ? (
                                            <>
                                                { image?.media_details?.sizes?.large?.source_url && (
                                                    <img src={ image?.media_details?.sizes?.large?.source_url } alt="" />
                                                ) }
                                                <div className="media-uploader-actions">
                                                    <Button 
                                                        size="small"
                                                        onClick={ open }
                                                        variant="secondary"
                                                        text={ __( "Replace Media", "cinemarathon" ) }
                                                    />
                                                    <Button
                                                        size="small"
                                                        onClick={ () => setAttributes( { image: 0 } ) }
                                                        isDestructive={ true }
                                                        text={ __( "Remove Media", "cinemarathon" ) }
                                                    />
                                                </div>
                                            </>
                                        ) : (
                                            <Button
                                                text={ __( "Select Media", "cinemarathon" ) }
                                                onClick={ open }
                                            />
                                        ) }
                                    </div>
                                ) }
                            />
                        </MediaUploadCheck>
                    </BaseControl>
                    <TextareaControl
                        label={ __( "Description of the marathon", "cinemarathon" ) }
                        value={ attributes.description }
                        onChange={ value => setAttributes( { description: value } ) }
                    />
                    <TextareaControl
                        label={ __( "Objectives of the marathon", "cinemarathon" ) }
                        value={ attributes.objectives }
                        onChange={ value => setAttributes( { objectives: value } ) }
                    />
                    <TextareaControl
                        label={ __( "Comments", "cinemarathon" ) }
                        value={ attributes.comments }
                        onChange={ value => setAttributes( { comments: value } ) }
                    />
                </PanelBody>
            </div>
        </InspectorControls>
    )
}

export default Settings