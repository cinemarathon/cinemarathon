import { registerBlockType } from "@wordpress/blocks"

import { Cinemarathons } from "./icons"
import Edit from "./edit"

import metadata from "./block.json"

import "./style.scss"

registerBlockType( metadata.name, {
    icon: Cinemarathons,
    edit: Edit,
} )