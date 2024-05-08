import { Button, Icon, ToggleControl, Tooltip } from '@wordpress/components';
import { useEffect, useState } from '@wordpress/element';
import { plus } from '@wordpress/icons';
import { __, _n, sprintf } from '@wordpress/i18n';

import { Available, BlogPost, Bonus, Check, DoubleCheck } from '../icons';

import BulkEditor from './BulkEditor';
import ListEditor from './ListEditor';

const Editor = ( { attributes, setAttributes, itemsHandler } ) => {
	const [ advancedEditingMode, setAdvancedEditingMode ] = useState(
		attributes.expertMode
	);

	useEffect( () => {
		setAttributes( { expertMode: advancedEditingMode } );
		return () => {};
	}, [ advancedEditingMode ] );

	return (
		<div className="editor-table">
			<div className="editor-header">
				<div className="header-column column-watched check-column">
					<Tooltip
						delay={ 0 }
						placement="left"
						text={ __( 'Just watched it!', 'cinemarathons' ) }
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
						text={ __( 'Seen this one before', 'cinemarathons' ) }
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
						text={ __(
							'I have this movie right here',
							'cinemarathons'
						) }
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
						text={ __(
							'Bonus movie, not mandatory to watch',
							'cinemarathons'
						) }
					>
						<div>
							<Icon icon={ Bonus } />
						</div>
					</Tooltip>
				</div>
				<div className="header-column column-post-id check-column">
					<Tooltip
						delay={ 0 }
						placement="top"
						text={ __(
							'Related blog post',
							'cinemarathons'
						) }
					>
						<div>
							<Icon icon={ BlogPost } />
						</div>
					</Tooltip>
				</div>
				<div className="header-column column-title text-column">
					{ __( 'Movie Title', 'cinemarathons' ) }
				</div>
				<div className="header-column column-editing-mode">
					<ToggleControl
						label={ __( 'Expert Mode', 'cinemarathons' ) }
						checked={ advancedEditingMode }
						onChange={ () =>
							setAdvancedEditingMode( ! advancedEditingMode )
						}
						className="is-reverse is-small"
					/>
				</div>
			</div>
			<div className="editor-content">
				{ advancedEditingMode ? (
					<BulkEditor
						attributes={ attributes }
						setAttributes={ setAttributes }
						itemsHandler={ itemsHandler }
						setAdvancedEditingMode={ setAdvancedEditingMode }
					/>
				) : (
					<ListEditor
						attributes={ attributes }
						setAttributes={ setAttributes }
						itemsHandler={ itemsHandler }
					/>
				) }
			</div>
			<div className="editor-footer">
				<div className="footer-content">
					{ sprintf(
						// translators: %s: number of movies
						_n(
							'%s Movie',
							'%s Movies',
							attributes.movies.length,
							'cinemarathons'
						),
						attributes.movies.length
					) }
				</div>
				<div className="footer-actions">
					{ ! advancedEditingMode && (
						<Button
							className="add-new"
							size="small"
							variant="icon"
							label={ __( 'Add new movie', 'cinemarathons' ) }
							showTooltip={ true }
							onClick={ itemsHandler.add }
						>
							<Icon icon={ plus } size={ 20 } />
						</Button>
					) }
				</div>
			</div>
		</div>
	);
};

export default Editor;
