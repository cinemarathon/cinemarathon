import { registerBlockType } from "@wordpress/blocks"

import { __ } from "@wordpress/i18n"

import { Cinemarathons } from "../icons"
import Edit from "./edit"

registerBlockType("cinemarathons/marathons", {
    apiVersion: 2,
    title: __( "Cinemarathons", "cinemarathons" ),
    description: __( "Displays a list of all your cinemarathons.", "cinemarathons" ),
    category: "cinemarathons",
    attributes: {
        number: {
            type: "integer",
			default: 6
        },
        mode: {
            type: "string",
			default: "grid"
        },
        columns: {
            type: "integer",
			default: 2
        }
    },
    icon: Cinemarathons,
    edit: Edit,
});