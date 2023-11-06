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
import { useEffect, useState } from "@wordpress/element"
import {
	arrowUp,
	arrowDown,
	copy,
	trash,
	moreVertical,
	plus
} from "@wordpress/icons"

import { __, _n, sprintf } from "@wordpress/i18n"

import hash from "object-hash"

import { Available, Check, Cinemarathon, DoubleCheck } from "../icons"

import "./editor.css"

const Edit = ( { attributes, setAttributes } ) => {

	const blockProps = useBlockProps()

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

	const update = ( index, key, value ) => {
        let movies = [ ...attributes.movies ]
        movies[ index ][ key ] = value
		if ( 'title' === key ) {
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
	}, [] )

	useEffect( () => {
		if ( attributes.image ) {
			apiFetch( { path: `/wp/v2/media/${ attributes.image }` } ).then( response => {
				setImage( response )
			} )
		} else if ( 0 === attributes.image ) {
			setImage( {} )
		}
	}, [ attributes.image ] )

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
				<table className="wp-list-table widefat fixed striped">
					<thead>
						<tr>
							<th className="manage-column column-watched check-column">
								<Tooltip
									delay={ 0 }
									placement="left"
									text={ __( "Just watched it!", "cinemarathon" ) }
								>
									<div>
										<Icon icon={ Check } />
									</div>
								</Tooltip>
							</th>
							<th className="manage-column column-rewatch check-column">
								<Tooltip
									delay={ 0 }
									placement="top"
									text={ __( "Seen this one before", "cinemarathon" ) }
								>
									<div>
										<Icon icon={ DoubleCheck } />
									</div>
								</Tooltip>
							</th>
							<th className="manage-column column-available check-column">
								<Tooltip
									delay={ 0 }
									placement="top"
									text={ __( "I have this movie right here", "cinemarathon" ) }
								>
									<div>
										<Icon icon={ Available } />
									</div>
								</Tooltip>
							</th>
							<th className="manage-column column-title text-column">{ __( "Movie Title", "cinemarathon" ) }</th>
							<th className="manage-column column-actions check-column"></th>
						</tr>
					</thead>
					<tbody>
						{ attributes.movies.map( ( movie, index ) => (
							<tr key={ index } id={ movie.hash }>
								<td className="column-watched check-column">
									<CheckboxControl
										checked={ movie.watched }
										onChange={ value => update( index, 'watched', value ) }
									/>
								</td>
								<td className="column-rewatch check-column">
									<CheckboxControl
										checked={ movie.rewatch }
										onChange={ value => update( index, 'rewatch', value ) }
									/>
								</td>
								<td className="column-available check-column">
									<CheckboxControl
										checked={ movie.available }
										onChange={ value => update( index, 'available', value ) }
									/>
								</td>
								<td className="column-title text-column">
									<TextControl
										value={ movie.title }
										onChange={ value => update( index, 'title', value ) }
									/>
								</td>
								<td className={ `column-actions check-column ${ editing.includes( movie.hash ) ? 'show-actions' : ''}` }>
									<Button
										size="small"
										onClick={ () => toggleEditing( movie.hash ) }
									>
										<Icon
											icon={ moreVertical }
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
								</td>
							</tr>
						) ) }
					</tbody>
					<tfoot>
						<tr>
							<td className="manage-column column-text text-column" colSpan={ 4 }>
								<Text>
									{ sprintf( _n( '%s Movie', '%s Movies', attributes.movies.length ), attributes.movies.length ) }
								</Text>
							</td>
							<td className="manage-column column-actions check-column" colSpan={ 1 }>
								<Button
									size="small"
									label={ __( "Add new movie", "cinemarathon" ) }
									showTooltip={ true }
									onClick={ add }
								>
									<Icon
										icon={ plus }
										size={ 20 }
									/>
								</Button>
							</td>
						</tr>
					</tfoot>
				</table>
			</Placeholder>
		</div>
	)
}

export default Edit