import {
	Button,
	ButtonGroup,
	CheckboxControl,
	Dropdown,
	Flex,
	FlexItem,
	MenuGroup,
	MenuItemsChoice,
	Modal,
	ToggleControl,
} from '@wordpress/components';
import { useEffect, useState } from '@wordpress/element';
import { check, chevronDown, closeSmall } from '@wordpress/icons';
import { __, _n, sprintf } from '@wordpress/i18n';

import _ from 'underscore';

const ImporterModal = ( {
	credits,
	genresList,
	jobsList,
	searchPerson,
	closeModal,
	itemsHandler,
} ) => {
	const mediaType = 'movie';

	const [ creditsJob, setCreditsJob ] = useState( 'Director' );
	const [ creditsType, setCreditsType ] = useState( 'cast' );

	const [ filteredCredits, setFilteredCredits ] = useState( [] );
	const [ selection, setSelection ] = useState( [] );
	const [ showSelection, setShowSelection ] = useState( false );

	const filterCredits = () =>
		_.sortBy(
			_.filter( credits[ creditsType ] ?? [], ( credit ) => {
				const isMediaType = mediaType === credit.media_type;
				const isJob =
					'crew' === creditsType ? credit.job === creditsJob : true;
				return isMediaType && isJob;
			} ),
			'release_date'
		) ?? [];

	const addSelection = () =>
		itemsHandler.add(
			selection.map( ( creditId ) => {
				const credit = _.findWhere( credits[ creditsType ] ?? [], {
					creditId,
				} );
				return credit.length
					? {
							title: credit.title,
							tmdb_id: credit.id,
					  }
					: {};
			} )
		);

	useEffect( () => {
		setFilteredCredits( filterCredits() );
		return () => {};
	}, [ credits, creditsJob, creditsType ] );

	useEffect( () => {
		if ( showSelection ) {
			setFilteredCredits(
				selection.map( ( creditId ) =>
					_.findWhere( credits[ creditsType ] ?? [], {
						creditId,
					} )
				)
			);
		} else {
			setFilteredCredits( filterCredits() );
		}
		return () => {};
	}, [ showSelection ] );

	return (
		<Modal
			title={ sprintf(
				// translators: %s: Person name
				__( 'Select Movies/TV Shows from %s', 'cinemarathons' ),
				searchPerson.name
			) }
			onRequestClose={ closeModal }
			className="search-items-selector-modal"
		>
			<Flex className="filters">
				<FlexItem>
					<ButtonGroup>
						<Button
							variant="secondary"
							size="small"
							isPressed={ 'cast' === creditsType }
							icon={ 'cast' === creditsType ? closeSmall : check }
							iconSize={ 16 }
							onClick={ () =>
								setCreditsType(
									'cast' === creditsType ? 'crew' : 'cast'
								)
							}
						>
							{ __( 'Cast', 'cinemarathons' ) }
						</Button>
						<Button
							variant="secondary"
							size="small"
							isPressed={ 'crew' === creditsType }
							icon={ 'crew' === creditsType ? closeSmall : check }
							iconSize={ 16 }
							onClick={ () =>
								setCreditsType(
									'crew' === creditsType ? 'cast' : 'crew'
								)
							}
						>
							{ __( 'Crew', 'cinemarathons' ) }
						</Button>
					</ButtonGroup>
				</FlexItem>
				{ 'crew' === creditsType && (
					<FlexItem>
						<Dropdown
							position="bottom left"
							renderToggle={ ( { onToggle } ) => (
								<Button
									className="has-text has-right-icon"
									variant="secondary"
									size="small"
									isPressed={ true }
									text={ creditsJob }
									icon={ chevronDown }
									iconSize={ 16 }
									iconPosition="right"
									onClick={ onToggle }
								/>
							) }
							renderContent={ ( { onClose } ) => (
								<MenuGroup>
									<MenuItemsChoice
										choices={ jobsList.map( ( job ) => ( {
											label: job,
											value: job,
										} ) ) }
										onSelect={ ( value ) => {
											setCreditsJob( value );
											onClose();
										} }
										value={ creditsJob }
									/>
								</MenuGroup>
							) }
						/>
					</FlexItem>
				) }
			</Flex>
			<hr />
			<div className="editor-table">
				<div className="editor-header">
					<div className="header-column check-column">
						<CheckboxControl
							checked={
								filteredCredits.length &&
								filteredCredits.length === selection.length
							}
							onChange={ ( value ) =>
								setSelection(
									value
										? _.pluck(
												filteredCredits,
												'credit_id'
										  )
										: _.difference(
												selection,
												_.pluck(
													filteredCredits,
													'credit_id'
												)
										  )
								)
							}
							indeterminate={
								filteredCredits.length &&
								filteredCredits.length !== selection.length
							}
							__nextHasNoMarginBottom
						/>
					</div>
					<div className="header-column column-title text-column">
						{ __( 'Movie Title', 'cinemarathons' ) }
					</div>
				</div>
				<div className="editor-content">
					{ filteredCredits.length ? (
						filteredCredits.map( ( credit, key ) => (
							<div key={ key } className="list-item">
								<div className="list-item-column column-watched check-column">
									<CheckboxControl
										checked={
											-1 <
											_.indexOf(
												selection,
												credit.credit_id
											)
										}
										onChange={ ( value ) =>
											setSelection(
												value
													? _.unique( [
															...selection,
															credit.credit_id,
													  ] )
													: _.without(
															selection,
															credit.credit_id
													  )
											)
										}
									/>
								</div>
								<div className="list-item-column column-title text-column">
									<Button
										variant="link"
										text={ credit.title }
										target="_blank"
										href={ `https://www.themoviedb.org/movie/${ credit.id }` }
									/>
									<div>
										{ 'crew' === creditsType && (
											<span>{ credit.job }</span>
										) }
										{ credit.release_date ? (
											<span>
												{ new Date(
													credit.release_date
												).getFullYear() }
											</span>
										) : (
											<span>?</span>
										) }
										{ credit.genre_ids && (
											<span>
												{ _.pluck(
													credit.genre_ids.map(
														( id ) =>
															_.findWhere(
																genresList[
																	credit
																		.media_type
																] ?? [],
																{
																	id,
																}
															)
													),
													'name'
												).join( ', ' ) }
											</span>
										) }
									</div>
								</div>
							</div>
						) )
					) : (
						<div className="list-item">
							<p>
								{ __(
									'Nothing matches your selection. Maybe try some other filters?',
									'cinemarathons'
								) }
							</p>
						</div>
					) }
				</div>
				<div className="editor-footer">
					<div className="footer-content">
						{ sprintf(
							// translators: %s: Selected
							_n(
								'%s Selected',
								'%s Selected',
								selection.length,
								'cinemarathons'
							),
							selection.length
						) }
					</div>
					<div className="footer-actions">
						<ToggleControl
							label={ __( 'View Selection', 'cinemarathons' ) }
							checked={ showSelection }
							onChange={ () =>
								setShowSelection( ! showSelection )
							}
							className="is-reverse is-small"
						/>
					</div>
				</div>
			</div>
			<hr />
			<Button
				size="small"
				variant="primary"
				text={ __( 'Add Selection', 'cinemarathons' ) }
				disabled={ ! selection.length }
				onClick={ () => {
					addSelection();
					setSelection( [] );
					closeModal();
				} }
			/>
		</Modal>
	);
};

export default ImporterModal;
