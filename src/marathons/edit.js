import { useBlockProps } from "@wordpress/block-editor"
import {
	Placeholder,
	SelectControl,
	TextControl
} from "@wordpress/components"

import { __ } from "@wordpress/i18n"

import { Cinemarathon } from "../icons"

import "./editor.css"

const Edit = ({ attributes, setAttributes }) => {

	const blockProps = useBlockProps()

	return (
		<div { ...blockProps }>
			<Placeholder
				icon={ Cinemarathon }
				label={ __( "Cinemarathons", "cinemarathon" ) }
				instructions={ __( "Use this block to display a list of your marathons.", "cinemarathon" ) }
			>
				<div>
					<TextControl
						label={ __( "Number of marathons to display", "cinemarathon" ) }
						type="number"
						min={ 1 }
						max={ 99 }
						step={ 1 }
						value={ attributes.number }
						onChange={ ( value ) => ( setAttributes( { number: value } ) ) }
					/>
					<SelectControl
						label={ __( "Display mode", "cinemarathon" ) }
						options={ [
							{
								label: 'Liste',
								value: 'list'
							},
							{
								label: 'Grille',
								value: 'grid'
							}
						] }
						value={ attributes.mode }
						onChange={ ( value ) => setAttributes( { mode: value } ) }
					/>
					{ 'grid' === attributes.mode && (
						<TextControl
							label={ __( "Number of columns", "cinemarathon" ) }
							type="number"
							min={ 1 }
							max={ 4 }
							step={ 1 }
							value={ attributes.columns }
							onChange={ ( value ) => ( setAttributes( { columns: value } ) ) }
						/>
					) }
				</div>
			</Placeholder>
		</div>
	)
}

export default Edit