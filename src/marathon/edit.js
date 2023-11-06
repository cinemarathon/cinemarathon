import apiFetch from "@wordpress/api-fetch"
import {
	InspectorControls,
	MediaUpload,
	MediaUploadCheck,
	useBlockProps
} from "@wordpress/block-editor"
import {
	BaseControl,
	Button,
	ButtonGroup,
	CheckboxControl,
	Icon,
	PanelBody,
	Placeholder,
	TextareaControl,
	TextControl,
	Tooltip,
	__experimentalSurface as Surface,
	__experimentalText as Text
} from "@wordpress/components"
import { useEffect, useRef, useState } from "@wordpress/element"
import {
	arrowUp,
	arrowDown,
	copy,
	closeSmall,
	trash,
	moreVertical,
	plus
} from "@wordpress/icons"

import { __, _n, sprintf } from "@wordpress/i18n"

import hash from "object-hash"

import { Available, Batch, Bonus, Check, Cinemarathon, DoubleCheck } from "../icons"

import "./editor.css"

const Edit = ( { attributes, setAttributes } ) => {

	const blockProps = useBlockProps()

	const [ batchMode, setBatchMode ] = useState( false )
	const [ batchList, setBatchList ] = useState( "" )
	const [ batchEditorHeight, setbatchEditorHeight ] = useState( 80 )

	const [ editing, setEditing ] = useState( [] )
	const [ image, setImage ] = useState( {} )

	const toggleEditing = ( target ) => {
		if ( editing.includes( target ) ) {
			setEditing( editing.filter( item => item !== target ) )
		} else {
			setEditing( [ ...editing, target] )
		}
	}

	const emptyMovie = {
		watched: false,
		rewatch: false,
		available: false,
		title: "",
		tmdb_id: ""
	}

	const add = () => setAttributes( { movies: [ ...attributes.movies, { ...emptyMovie, hash: generateHash() } ] } )

	const batch = () => {
		setAttributes( { movies: [ ...attributes.movies, ...batchList.split("\n").map(item => ( { ...emptyMovie, hash: generateHash( item ), title: item } ) ) ] } )
		setBatchList( "" )
	}

	const update = ( index, key, value ) => {
        let movies = [ ...attributes.movies ]
        movies[ index ][ key ] = value
		if ( "title" === key ) {
			movies[ index ].hash = generateHash( '' !== value ? `${value}-${index}` : value )
		}
        setAttributes( { movies: movies } )
    }

	const remove = ( index ) => {
		let movies = [ ...attributes.movies ]
		movies.splice( index, 1 )
		setAttributes( { movies: movies } )
		setEditing( [] )
	}

	const move = ( index, destination ) => {
        let movies = [ ...attributes.movies ]
        if ( index < 0 ||  index >= movies.length || destination < 0 || destination >= movies.length ) {
            return
        }
        movies.splice( destination, 0, movies.splice( index, 1 ).pop() )
        setAttributes( { movies: movies } )
    }

    const moveDown = ( index ) => {
        return move( index, index + 1 )
    }
    
    const moveUp = ( index ) => {
        return move( index, index - 1 )
    }

	const duplicate = ( index ) => {
        setAttributes( { movies: [ ...attributes.movies, { ...attributes.movies[ index ] } ] } )
    }

	const generateHash = ( value = '' ) => hash.MD5( '' !== value ? value : Math.random().toString( 36 ) )

	useEffect( () => {
		let movies = []
		attributes.movies.map( ( movie, index ) =>
			movies.push( { ...movie, hash: generateHash( '' !== movie.title ? `${movie.title}-${index}` : '' ) } ) )
		setAttributes( { movies: [ ...movies ] } )
		return () => {}
	}, [] )

	useEffect( () => {
		if ( ! attributes.id ) {
			setAttributes( { id: Date.now() } )
		}
		return () => {}
	}, [] )

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

	useEffect( () => {
		if ( "" !== batchList ) {
			const rows = Math.max( 4, batchList.match(/\n/g)?.length ?? 0 )
			if ( rows ) {
				setbatchEditorHeight( Math.round( rows * 24 ) )
			}
		}
		return () => {}
	}, [ batchList ] )

	return (
		<div { ...blockProps }>
			<Placeholder
				icon={ Cinemarathon }
				label={ __( "Cinemarathon", "cinemarathon" ) }
				instructions={ __( "Use this block to display and manage a marathon. Add and sort movies, keep track of you current position, and have fun watching awesome movies!", "cinemarathon" ) }
			>
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
				<div className="list-editor">
					<div className="list-header">
						<div className="header-column column-watched check-column">
							<Tooltip
								delay={ 0 }
								placement="left"
								text={ __( "Just watched it!", "cinemarathon" ) }
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
					</div>
					{ attributes.movies.length ? (
						<div className="list-content">
							{ attributes.movies.map( ( movie, index ) => (
								<div className="list-item" key={ index } id={ movie.hash }>
									<div className="list-item-column column-watched check-column">
										<CheckboxControl
											checked={ movie.watched }
											onChange={ value => update( index, 'watched', value ) }
										/>
									</div>
									<div className="list-item-column column-rewatch check-column">
										<CheckboxControl
											checked={ movie.rewatch }
											onChange={ value => update( index, 'rewatch', value ) }
										/>
									</div>
									<div className="list-item-column column-available check-column">
										<CheckboxControl
											checked={ movie.available }
											onChange={ value => update( index, 'available', value ) }
										/>
									</div>
									<div className="list-item-column column-bonus check-column">
										<CheckboxControl
											checked={ movie.bonus }
											onChange={ value => update( index, 'bonus', value ) }
										/>
									</div>
									<div className="list-item-column column-title text-column">
										<TextControl
											value={ movie.title }
											onChange={ value => update( index, 'title', value ) }
										/>
									</div>
									<div className={ `list-item-column column-actions check-column ${ editing.includes( movie.hash ) ? 'show-actions' : ''}` }>
										<Button
											size="small"
											isPressed={ editing.includes( movie.hash ) }
											onClick={ () => toggleEditing( movie.hash ) }
										>
											<Icon
												icon={ editing.includes( movie.hash ) ? closeSmall : moreVertical }
												size={ 20 }
											/>
										</Button>
										<div className="actions">
											<Button
												label={ __( "Move Up", "cinemarathon" ) }
												size="small"
												showTooltip={ true }
												disabled={ '' == movie.hash }
												onClick={ () => moveUp( index ) }
											>
												<Icon
													icon={ arrowUp }
													size={ 20 }
												/>
											</Button>
											<Button
												label={ __( "Move Down", "cinemarathon" ) }
												size="small"
												showTooltip={ true }
												disabled={ '' == movie.hash }
												onClick={ () => moveDown( index ) }
											>
												<Icon
													icon={ arrowDown }
													size={ 20 }
												/>
											</Button>
											<Button
												label={ __( "Duplicate", "cinemarathon" ) }
												size="small"
												showTooltip={ true }
												onClick={ () => duplicate( index ) }
											>
												<Icon
													icon={ copy }
													size={ 20 }
												/>
											</Button>
											<Button
												label={ __( "Remove", "cinemarathon" ) }
												size="small"
												showTooltip={ true }
												onClick={ () => remove( index ) }
											>
												<Icon
													icon={ trash }
													size={ 20 }
												/>
											</Button>
										</div>
									</div>
								</div>
							) ) }
							{ batchMode && (
								<div className="batch-editor">
									<TextareaControl
										style={ { height: `${ batchEditorHeight }px` } }
										value={ batchList }
										onChange={ value => setBatchList( value ) }
									/>
									<div className="actions">
										<Text>
											{ __( "Type in a list of movies to add, one per line", "cinemarathon" ) }
										</Text>
										<Button
											size="small"
											variant="primary"
											text={ __( "Add movies", "cinemarathon" ) }
											onClick={ batch }
										/>
									</div>
								</div>
							) }
						</div>
					) : (
						<div className="list-content">
							<div className="placeholder">
								<Text>{ __( "This marathon does not have any movie yet.", "cinemarathon" ) }</Text>
								<Button
									variant="link"
									onClick={ add }
								>
									{ __( "Start by adding one!", "cinemarathon" ) }
								</Button>
							</div>
						</div>
					) }
					<div className="list-footer">
						<div className="footer-content">
							{ sprintf( _n( '%s Movie', '%s Movies', attributes.movies.length ), attributes.movies.length ) }
						</div>
						<div className="footer-actions">
							<Button
								className="batch-add"
								size="small"
								variant="icon"
								label={ __( "Batch add movies", "cinemarathon" ) }
								showTooltip={ true }
								onClick={ () => setBatchMode( ! batchMode ) }
								isPressed={ batchMode }
							>
								<Icon
									icon={ Batch }
									size={ 32 }
								/>
							</Button>
							<Button
								className="add-new"
								size="small"
								variant="icon"
								label={ __( "Add new movie", "cinemarathon" ) }
								showTooltip={ true }
								onClick={ add }
							>
								<Icon
									icon={ plus }
									size={ 20 }
								/>
							</Button>
						</div>
					</div>
				</div>
			</Placeholder>
		</div>
	)
}

export default Edit