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
				const selectedPost =
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
					id: selectedPost.id,
					date: selectedPost.date,
					link: selectedPost.link,
					title: selectedPost.title?.rendered ?? '',
					excerpt: selectedPost.excerpt?.rendered ?? '',
					image:
						( ( selectedPost._embedded || {} )[ 'wp:featuredmedia' ] ||
							[] )[ 0 ] ?? {},
					categories:
						filter(
							flatten(
								( selectedPost._embedded || {} )[ 'wp:term' ] || []
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
					const { label, date: publicationDate } = item;
					return (
						<div>
							<div style={ { marginBottom: '0.2rem' } }>
								<strong>{ label }</strong>
							</div>
							<small>
								{ sprintf(
									// translators: %s: publication date
									__( 'Published %s', 'cinemarathons' ),
									publicationDate
								) }
							</small>
						</div>
					);
				} }
			/>
			{ post.id && (
				<>
					<BaseControl
						id={ `post-preview-${ post.id }` }
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
												// translators: %1$s: date, %2$s: time
												__(
													'Published <strong>%1$s</strong> at %2$s',
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
												// translators: %s: list of categories
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
