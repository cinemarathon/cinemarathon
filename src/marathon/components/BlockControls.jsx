import apiFetch from '@wordpress/api-fetch';
import {
	MediaUpload,
	MediaUploadCheck,
} from '@wordpress/block-editor';
import {
	BaseControl,
	Button,
	PanelBody,
	TextareaControl,
	TextControl,
	__experimentalHStack as HStack,
} from '@wordpress/components';
import { useEffect, useState } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import Importer from './importer/Importer';

const Settings = ( { attributes, setAttributes, itemsHandler } ) => {
	const [ image, setImage ] = useState( {} );

	useEffect( () => {
		if ( attributes.image ) {
			apiFetch( { path: `/wp/v2/media/${ attributes.image }` } ).then(
				( response ) => {
					setImage( response );
				}
			);
		} else if ( 0 === attributes.image ) {
			setImage( {} );
		}
		return () => {};
	}, [ attributes.image ] );

	return (
		<div className="cinemarathons-marathon-block-inspector">
			<PanelBody>
				<Importer itemsHandler={ itemsHandler } />
			</PanelBody>
			<PanelBody>
				<TextControl
					label={ __(
						'Title of the marathon',
						'cinemarathons'
					) }
					value={ attributes.title }
					onChange={ ( value ) =>
						setAttributes( { title: value } )
					}
				/>
				<BaseControl
					id="marathon-featured-image"
					label={ __(
						'Featured image of the marathon',
						'cinemarathons'
					) }
				>
					<MediaUploadCheck>
						<MediaUpload
							allowedTypes={ [ 'image' ] }
							onSelect={ ( selection ) =>
								setAttributes( { image: selection.id } )
							}
							render={ ( { open } ) => (
								<div className="marathon-featured-image">
									<Button onClick={ open }>
										{ attributes.image &&
										image?.media_details?.sizes
											?.large?.source_url ? (
											<img
												className="marathon-featured-image__image"
												src={
													image?.media_details
														?.sizes?.large
														?.source_url
												}
												alt=""
											/>
										) : (
											<p className="marathon-featured-image__text">
												{ __(
													'Select Media',
													'cinemarathons'
												) }
											</p>
										) }
									</Button>
									{ attributes.image ? (
										<HStack className="marathon-featured-image__actions">
											<Button
												onClick={ open }
												variant="secondary"
												text={ __(
													'Replace',
													'cinemarathons'
												) }
												className="marathon-featured-image__button marathon-featured-image__replace"
											/>
											<Button
												onClick={ () =>
													setAttributes( {
														image: 0,
													} )
												}
												variant="secondary"
												text={ __(
													'Remove',
													'cinemarathons'
												) }
												className="marathon-featured-image__button marathon-featured-image__remove"
											/>
										</HStack>
									) : (
										''
									) }
								</div>
							) }
						/>
					</MediaUploadCheck>
				</BaseControl>
				<TextareaControl
					label={ __(
						'Description of the marathon',
						'cinemarathons'
					) }
					value={ attributes.description }
					onChange={ ( value ) =>
						setAttributes( { description: value } )
					}
				/>
				<TextareaControl
					label={ __(
						'Objectives of the marathon',
						'cinemarathons'
					) }
					value={ attributes.objectives }
					onChange={ ( value ) =>
						setAttributes( { objectives: value } )
					}
				/>
				<TextareaControl
					label={ __( 'Comments', 'cinemarathons' ) }
					value={ attributes.comments }
					onChange={ ( value ) =>
						setAttributes( { comments: value } )
					}
				/>
			</PanelBody>
		</div>
	);
};

export default Settings;
