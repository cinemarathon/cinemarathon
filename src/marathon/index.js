import { registerBlockType } from "@wordpress/blocks"

import { Cinemarathon } from "../icons"
import Edit from "./edit"

import metadata from "./block.json"

import "./style.scss"

registerBlockType( metadata.name, {
    icon: Cinemarathon,
    edit: Edit,
} )