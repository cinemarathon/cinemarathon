import apiFetch from '@wordpress/api-fetch';
import {
	InspectorControls,
	MediaUpload,
	MediaUploadCheck,
} from '@wordpress/block-editor';
import {
	BaseControl,
	Button,
	ButtonGroup,
	CheckboxControl,
	Dropdown,
	Flex,
	FlexItem,
	MenuGroup,
	MenuItemsChoice,
	Modal,
	PanelBody,
	SelectControl,
	TextareaControl,
	TextControl,
	ToggleControl,
	__experimentalHStack as HStack,
	__experimentalText as Text,
} from '@wordpress/components';
import { useDebounce } from '@wordpress/compose';
import { useEffect, useState } from '@wordpress/element';
import { check, chevronDown, closeSmall } from '@wordpress/icons';
import { __, _n, sprintf } from '@wordpress/i18n';

const { pick } = lodash;

import { Movie, Person, TV } from '../icons';

const Settings = ( { attributes, setAttributes, itemsHandler } ) => {
	const APIKEY = cinemarathons_options?.api?.tmdb_api_key ?? '';
	const LOCALE = cinemarathons_options?.locale ?? 'en-US';

	const [ showModal, setShowModal ] = useState( false );

	const closeModal = () => setShowModal( false );
	const openModal = () => setShowModal( true );

	const [ image, setImage ] = useState( {} );
	const [ searchPerson, setSearchPerson ] = useState( [] );
	const [ searchQuery, setSearchQuery ] = useState( '' );
	const [ searchResults, setSearchResults ] = useState( [] );
	const [ searchType, setSearchType ] = useState( 'multi' );

	const [ credits, setCredits ] = useState( {} );
	const [ creditsJob, setCreditsJob ] = useState( 'Director' );
	const [ creditsType, setCreditsType ] = useState( 'cast' );

	const [ jobsList, setJobsList ] = useState( [] );
	const [ mediaType, setMediaType ] = useState( 'movie' );

	const [ filteredCredits, setFilteredCredits ] = useState( [] );
	const [ selection, setSelection ] = useState( [] );
	const [ showSelection, setShowSelection ] = useState( false );

	const [ genresList, setGenresList ] = useState(
		JSON.parse( localStorage.getItem( 'tmdbGenres' ) ?? '{}' )
	);
	const loadGenresList = async () => {
		const genres = {
			movie: [],
			tv: [],
		};
		await fetch(
			`https://api.themoviedb.org/3/genre/movie/list?api_key=${ APIKEY }`
		).then( ( response ) =>
			response
				.json()
				.then( ( data ) => ( genres.movie = data.genres ?? [] ) )
		);
		await fetch(
			`https://api.themoviedb.org/3/genre/tv/list?api_key=${ APIKEY }`
		).then( ( response ) =>
			response
				.json()
				.then( ( data ) => ( genres.tv = data.genres ?? [] ) )
		);
		setGenresList( genres );
	};

	const loadCombinedCredits = () => {
		if ( searchPerson.id ) {
			fetch(
				`https://api.themoviedb.org/3/person/${ searchPerson.id }/combined_credits?api_key=${ APIKEY }&language=${LOCALE}`
			)
				.then( ( response ) => response.json() )
				.then( ( data ) => setCredits( data ) );
		}
	};

	const searchOnTMDb = () => {
		if ( '' !== searchQuery ) {
			fetch(
				`https://api.themoviedb.org/3/search/${ searchType }?api_key=${ APIKEY }&query=${ searchQuery }&include_adult=false&language=${LOCALE}&page=1`
			).then( ( response ) =>
				response
					.json()
					.then( ( data ) =>
						setSearchResults(
							_.sortBy( data.results, 'media_type' )
						)
					)
			);
		} else {
			setSearchResults( [] );
		}
	};

	const debouncedSearch = useDebounce( searchOnTMDb, 500 );

	const filterCredits = () =>
		_.sortBy(
			_.filter( credits[ creditsType ] ?? [], ( credit ) => {
				const isMediaType = mediaType === credit.media_type;
				const isJob =
					'crew' === creditsType ? credit.job === creditsJob : true;
				return isMediaType && isJob;
			} ),
			'tv' === mediaType ? 'first_air_date' : 'release_date'
		);

	const addSelection = () =>
		itemsHandler.add(
			selection.map( ( credit_id ) => {
				const credit = _.findWhere( credits[ creditsType ] ?? [], {
					credit_id,
				} );
				if ( credit ) {
					return {
						title:
							'tv' === credit.media_type
								? credit.name
								: credit.title,
						tmdb_id: credit.id,
					};
				}
			} )
		);

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

	useEffect( () => {
		setFilteredCredits( filterCredits() );
	}, [ credits, creditsJob, creditsType, mediaType ] );

	useEffect( () => {
		if ( showSelection ) {
			setFilteredCredits(
				selection.map( ( credit_id ) =>
					_.findWhere( credits[ creditsType ] ?? [], {
						credit_id,
					} )
				)
			);
		} else {
			setFilteredCredits( filterCredits() );
		}
		return () => {};
	}, [ showSelection ] );

	useEffect( () => {
		debouncedSearch();
		return () => {};
	}, [ searchQuery ] );

	useEffect( () => {
		searchOnTMDb();
		return () => {};
	}, [ searchType ] );

	useEffect( () => {
		if ( searchPerson.id ) {
			loadCombinedCredits();
		}
		return () => {};
	}, [ searchPerson ] );

	useEffect( () => {
		setJobsList( _.unique( _.pluck( credits.crew, 'job' ) ).sort() );
		return () => {};
	}, [ credits ] );

	useEffect( () => {
		loadGenresList();
		return () => {};
	}, [] );

	return (
		<>
			<InspectorControls key="setting">
				<div className="cinemarathons-marathon-block-inspector">
					<PanelBody>
						<BaseControl
							className="search-form"
							label={ __(
								'Search on TheMovieDB',
								'cinemarathons'
							) }
							help={
								! APIKEY
									? 'A valid TMDb API Key is required. You can get your key on themoviedb.org and set it in the API section of the Settings page.'
									: ''
							}
						>
							<TextControl
								className="search-query"
								placeholder={ __(
									'Search a movie, an actor, a director…',
									'cinemarathons'
								) }
								value={ searchQuery }
								onChange={ ( value ) =>
									setSearchQuery( value )
								}
							/>
							<SelectControl
								className="search-type"
								size="small"
								suffix=" "
								value={ searchType }
								options={ [
									{
										value: 'multi',
										label: __( 'All', 'cinemarathons' ),
										default: '',
									},
									{
										value: 'movie',
										label: __( 'Movie', 'cinemarathons' ),
										default: '',
									},
									{
										value: 'person',
										label: __( 'Person', 'cinemarathons' ),
										default: '',
									},
									{
										value: 'tv',
										label: __( 'TV', 'cinemarathons' ),
										default: '',
									},
								] }
								onChange={ ( value ) => setSearchType( value ) }
								disabled={ ! APIKEY }
							/>
						</BaseControl>
						{ searchResults.length ? (
							<ul className="search-results">
								{ searchResults.map( ( result, key ) => (
									<li key={ key }>
										{ ( 'person' === searchType ||
											'person' ===
												result.media_type ) && (
											<Button
												key={ key }
												onClick={ () => {
													setSearchPerson( result );
													openModal();
												} }
												icon={ Person }
											>
												<span className="name">
													{ result.name }
												</span>
												<span
													className="known-for"
													dangerouslySetInnerHTML={ {
														__html: sprintf(
															__(
																'Known for <strong>%s</strong>, <em>%s</em>',
																'cinemarathons'
															),
															result.known_for_department,
															_.pluck(
																result.known_for ??
																	[],
																'title'
															).join(
																'</em>, <em>'
															)
														),
													} }
												/>
											</Button>
										) }
										{ ( 'movie' === searchType ||
											'movie' === result.media_type ) && (
											<Button
												key={ key }
												onClick={ () => {
													itemsHandler.add( [
														{
															title: result.title,
															tmdb_id: result.id,
														},
													] );
													setSearchQuery( '' );
													setSearchResults( [] );
												} }
												icon={ Movie }
											>
												<span className="name">
													{ result.title }
												</span>
												<span
													className="details"
													dangerouslySetInnerHTML={ {
														__html: sprintf(
															__(
																'<strong>%s</strong> – <em>%s</em>',
																'cinemarathons'
															),
															new Date(
																result.release_date
															).getFullYear(),
															(
																result.genre_ids ??
																[]
															).join(
																'</em>, <em>'
															)
														),
													} }
												/>
											</Button>
										) }
										{ ( 'tv' === searchType ||
											'tv' === result.media_type ) && (
											<Button
												key={ key }
												onClick={ () => {
													itemsHandler.add( [
														{
															title: result.title,
															tmdb_id: result.id,
														},
													] );
													setSearchQuery( '' );
													setSearchResults( [] );
												} }
												icon={ TV }
											>
												<span className="name">
													{ result.title }
												</span>
												<span
													className="details"
													dangerouslySetInnerHTML={ {
														__html: sprintf(
															__(
																'<strong>%s</strong> – <em>%s</em>',
																'cinemarathons'
															),
															new Date(
																result.release_date
															).getFullYear(),
															(
																result.genre_ids ??
																[]
															).join(
																'</em>, <em>'
															)
														),
													} }
												/>
											</Button>
										) }
									</li>
								) ) }
							</ul>
						) : (
							''
						) }
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
							label={ __(
								'Featured image of the marathon',
								'cinemarathons'
							) }
						>
							<MediaUploadCheck>
								<MediaUpload
									allowedTypes={ [ 'image' ] }
									onSelect={ ( image ) =>
										setAttributes( { image: image.id } )
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
													<Text className="marathon-featured-image__text">
														{ __(
															'Select Media',
															'cinemarathons'
														) }
													</Text>
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
			</InspectorControls>
			{ showModal && (
				<Modal
					title={ sprintf(
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
									icon={
										'cast' === creditsType
											? closeSmall
											: check
									}
									iconSize={ 16 }
									onClick={ () =>
										setCreditsType(
											'cast' === creditsType
												? 'crew'
												: 'cast'
										)
									}
								>
									{ __( 'Cast', 'cinemarathons' ) }
								</Button>
								<Button
									variant="secondary"
									size="small"
									isPressed={ 'crew' === creditsType }
									icon={
										'crew' === creditsType
											? closeSmall
											: check
									}
									iconSize={ 16 }
									onClick={ () =>
										setCreditsType(
											'crew' === creditsType
												? 'cast'
												: 'crew'
										)
									}
								>
									{ __( 'Crew', 'cinemarathons' ) }
								</Button>
							</ButtonGroup>
						</FlexItem>
						<FlexItem>
							<ButtonGroup>
								<Button
									className="has-text"
									variant="secondary"
									size="small"
									isPressed={ 'movie' === mediaType }
									text={ __( 'Movie', 'cinemarathons' ) }
									icon={
										'movie' === mediaType
											? closeSmall
											: check
									}
									iconSize={ 16 }
									onClick={ () =>
										setMediaType(
											'movie' === mediaType
												? 'tv'
												: 'movie'
										)
									}
								/>
								<Button
									className="has-text"
									variant="secondary"
									size="small"
									isPressed={ 'tv' === mediaType }
									text={ __( 'TV', 'cinemarathons' ) }
									icon={
										'tv' === mediaType ? closeSmall : check
									}
									iconSize={ 16 }
									onClick={ () =>
										setMediaType(
											'tv' === mediaType ? 'movie' : 'tv'
										)
									}
								/>
							</ButtonGroup>
						</FlexItem>
						{ 'crew' === creditsType && (
							<FlexItem>
								<Dropdown
									position="bottom left"
									renderToggle={ ( { isOpen, onToggle } ) => (
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
												choices={ jobsList.map(
													( job ) => ( {
														label: job,
														value: job,
													} )
												) }
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
										filteredCredits.length ===
											selection.length
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
										filteredCredits.length !==
											selection.length
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
											{ 'tv' === credit.media_type && (
												<>
													<Button
														variant="link"
														text={ credit.name }
														target="_blank"
														href={ `https://www.themoviedb.org/tv/${ credit.id }` }
													/>
													<div>
														{ 'crew' ===
															creditsType && (
															<span>
																{ __(
																	credit.job,
																	'cinemarathons'
																) }
															</span>
														) }
														{ credit.first_air_date ? (
															<span>
																{ new Date(
																	credit.first_air_date
																).getFullYear() }
															</span>
														) : (
															<span>?</span>
														) }
														{ credit.genre_ids && (
															<span>
																{ _.pluck(
																	credit.genre_ids.map(
																		(
																			id
																		) =>
																			_.findWhere(
																				genresList[
																					credit
																						.media_type
																				] ??
																					[],
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
												</>
											) }
											{ 'movie' === credit.media_type && (
												<>
													<Button
														variant="link"
														text={ credit.title }
														target="_blank"
														href={ `https://www.themoviedb.org/movie/${ credit.id }` }
													/>
													<div>
														{ 'crew' ===
															creditsType && (
															<span>
																{ __(
																	credit.job,
																	'cinemarathons'
																) }
															</span>
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
																		(
																			id
																		) =>
																			_.findWhere(
																				genresList[
																					credit
																						.media_type
																				] ??
																					[],
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
												</>
											) }
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
									_n(
										'%s Item, %d Selected',
										'%s Items, %d Selected',
										credits.cast?.length
									),
									credits.cast?.length,
									selection.length
								) }
							</div>
							<div className="footer-actions">
								<ToggleControl
									label={ __(
										'View Selection',
										'cinemarathons'
									) }
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
			) }
		</>
	);
};

export default Settings;
