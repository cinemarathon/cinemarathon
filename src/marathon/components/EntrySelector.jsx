import {
	BaseControl,
	Button,
	ButtonGroup,
	ComboboxControl,
} from '@wordpress/components';
import { useDebounce } from '@wordpress/compose';
import { store as coreStore } from '@wordpress/core-data';
import { dispatch, useSelect } from '@wordpress/data';
import { date, dateI18n } from '@wordpress/date';
import { useMemo, useState } from '@wordpress/element';
import { decodeEntities } from '@wordpress/html-entities';

import { __, sprintf } from '@wordpress/i18n';

import { filter, flatten } from 'lodash';

const EntrySelector = ( { entry, setEntry, closeModal } ) => {
	const [ search, setSearch ] = useState( '' );
	const [ postID, setPostID ] = useState( entry.id ?? 0 );

	const debouncedSearch = useDebounce( setSearch, 500 );

	const { searchResults } = useSelect(
		( select ) => {
			let searchResults = [];
			if ( search ) {
				searchResults =
					select( coreStore ).getEntityRecords( 'postType', 'post', {
						per_page: 10,
						_fields: 'id,title,date,categories,tags',
						context: 'view',
						search,
					} ) ?? [];
			}
			return { searchResults };
		},
		[ search ]
	);

	const suggestions = useMemo( () => {
		return ( searchResults ?? [] ).map( ( post ) => ( {
			value: parseInt( post.id ),
			label: decodeEntities( post.title.rendered ),
			date: post.date,
			categories: post.categories,
		} ) );
	}, [ searchResults ] );

	const select = () => {
		dispatch( 'core/notices' ).createNotice(
			'success',
			__(
				"Journal Entry selected properly. Don't forget to save your post!",
				''
			),
			{
				type: 'snackbar',
				isDismissible: true,
				actions: [
					{
						onClick: () =>
							wp.data.dispatch( 'core/editor' ).savePost(),
						label: __( 'Save Post' ),
					},
				],
			}
		);
		setEntry( { ...entry, id: postID } );
		closeModal();
	};

	const post = useSelect(
		( select ) => {
			if ( postID ) {
				const post =
					select( coreStore ).getEntityRecord(
						'postType',
						'post',
						postID,
						{
							_embed: 1,
							context: 'view',
						}
					) ?? {};
				return {
					id: post.id,
					date: post.date,
					link: post.link,
					title: post.title?.rendered ?? '',
					excerpt: post.excerpt?.rendered ?? '',
					image:
						( ( post._embedded || {} )[ 'wp:featuredmedia' ] ||
							[] )[ 0 ] ?? {},
					categories:
						filter(
							flatten(
								( post._embedded || {} )[ 'wp:term' ] || []
							) ?? [],
							{ taxonomy: 'category' }
						) ?? [],
				};
			}
			return {};
		},
		[ postID ]
	);

	return (
		<>
			<ComboboxControl
				label={ __( 'Search posts:', 'cinemarathons' ) }
				value={ post?.title?.rendered ?? '' }
				onChange={ setPostID }
				options={ suggestions }
				onFilterValueChange={ debouncedSearch }
				__experimentalRenderItem={ ( { item } ) => {
					const { label, date, categories } = item;
					return (
						<div>
							<div style={ { marginBottom: '0.2rem' } }>
								<strong>{ label }</strong>
							</div>
							<small>
								{ sprintf(
									__( 'Published %s', 'cinemarathons' ),
									date
								) }
							</small>
						</div>
					);
				} }
			/>
			{ post.id && (
				<>
					<BaseControl
						label={
							post.id === entry.id
								? __( 'Current entry:', 'cinemarathons' )
								: __( 'New entry:', 'cinemarathons' )
						}
					>
						<div className="post-preview">
							{ post.image.id && (
								<img
									src={
										post.image.media_details?.sizes
											?.thumbnail?.source_url
									}
									alt={
										post.image.media_details?.image_meta
											?.caption ?? ''
									}
								/>
							) }
							<div>
								<div className="title">{ post.title }</div>
								<div className="meta">
									<span
										className="date"
										dangerouslySetInnerHTML={ {
											__html: sprintf(
												__(
													'Published <strong>%s</strong> at %s',
													'cinemarathons'
												),
												dateI18n( 'F j, Y', post.date ),
												date( 'H:i', post.date )
											),
										} }
									/>
									<span
										className="categories"
										dangerouslySetInnerHTML={ {
											__html: sprintf(
												__( 'In %s', 'cinemarathons' ),
												post.categories
													.map(
														( category ) =>
															`<strong>${ category.name }</strong>`
													)
													.join( ', ' )
											),
										} }
									/>
								</div>
								<div
									className="content"
									dangerouslySetInnerHTML={ {
										__html: post.excerpt,
									} }
								/>
							</div>
							<ButtonGroup>
								<Button
									variant="link"
									href={ post.link }
									target="_blank"
									text={ __( 'Preview', 'cinemarathons' ) }
								/>
								<Button
									variant="link"
									href={ `/wp-admin/post.php?post=${ post.id }&action=edit` }
									target="_blank"
									text={ __( 'Edit', 'cinemarathons' ) }
								/>
							</ButtonGroup>
						</div>
					</BaseControl>
					{ post.id !== entry.id ? (
						<Button
							text={ __( 'Cancel' ) }
							variant="secondary"
							onClick={ closeModal }
							className="cancel-button"
						/>
					) : (
						<Button
							text={ __( 'Remove' ) }
							variant="secondary"
							isDestructive={ true }
							onClick={ () => {
								setEntry( { ...entry, id: 0 } );
								setPostID( 0 );
								//closeModal()
							} }
							className="remove-button"
						/>
					) }
				</>
			) }
			<Button
				disabled={ ! post.id || post.id === entry.id }
				text={
					post.id
						? __( 'Replace entry', 'cinemarathons' )
						: __( 'Set as entry', 'cinemarathons' )
				}
				variant="primary"
				onClick={ select }
				className="submit-button"
			/>
		</>
	);
};

export default EntrySelector;