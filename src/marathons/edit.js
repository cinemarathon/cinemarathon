import { useBlockProps } from "@wordpress/block-editor"
import {
	Button,
	Placeholder,
	SelectControl,
	TextControl,
	__experimentalText as Text
} from "@wordpress/components"
import { useState } from "@wordpress/element"

import { __ } from "@wordpress/i18n"

import { Cinemarathon } from "../icons"

import "./editor.css"

const Edit = ({ attributes, setAttributes }) => {

	const blockProps = useBlockProps()

	const [ showHelp, setShowHelp ] = useState( false )

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
						help={
							<>
								<Text>{ __( "Note that this limit will be based on posts count, not marathons per se.", "cinemarathon" ) }</Text>
								{ showHelp ? (
									<Text> { __( "Cinemarathon is able to discover multiple marathons in a single post; As a result this block will query posts containing single 'Cinemarathon' blocks, not the individual 'Cinemarathon' blocks themselves; It means that, if multiple 'Cinemarathon' blocks are present in a single post, the total number of displayed blocks may exceed the specified number.", "cinemarathon" ) }</Text>
								) : ( '' ) }
								<Button
									variant="link"
									onClick={ () => setShowHelp( ! showHelp ) }
								>
									{ showHelp ? 'Got it!' : 'Learn more' }
								</Button>
							</>
						}
						type="number"
						min={ 1 }
						max={ 99 }
						step={ 1 }
						value={ attributes.number }
						onChange={ ( value ) => ( setAttributes( { number: parseInt( value ) } ) ) }
					/>
					<SelectControl
						label={ __( "Display mode", "cinemarathon" ) }
						options={ [
							{
								label: __( "List", "cinemarathon" ),
								value: 'list'
							},
							{
								label: __( "Grid", "cinemarathon" ),
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
							onChange={ ( value ) => ( setAttributes( { columns: parseInt( value ) } ) ) }
						/>
					) }
				</div>
			</Placeholder>
		</div>
	)
}

export default Edit