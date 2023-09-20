import { registerBlockType } from "@wordpress/blocks"

import { __ } from "@wordpress/i18n"

import { Cinemarathon } from "../icons"
import Edit from "./edit"

registerBlockType("cinemarathon/marathons", {
    apiVersion: 2,
    title: __( "Cinemarathons", "cinemarathon" ),
    description: __( "Displays a list of all your cinemarathons.", "cinemarathon" ),
    category: "cinemarathon",
    attributes: {
        title: {
            type: "string",
			default: ""
        },
        description: {
            type: "string",
			default: ""
        },
        objectives: {
            type: "string",
			default: ""
        },
        comments: {
            type: "string",
			default: ""
        },
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
    icon: Cinemarathon,
    edit: Edit,
});