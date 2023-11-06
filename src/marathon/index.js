import { registerBlockType } from "@wordpress/blocks"

import { __ } from "@wordpress/i18n"

import { Cinemarathons } from "../icons"
import Edit from "./edit"

registerBlockType("cinemarathons/marathon", {
    apiVersion: 2,
    title: __( "Cinemarathons", "cinemarathons" ),
    description: __( "Displays a list of movies you plan to watch along with a few options to add more fun to the fun.", "cinemarathons" ),
    category: "cinemarathons",
    attributes: {
        id: {
            type: "integer",
        },
        title: {
            type: "string",
			default: ""
        },
        image: {
            type: "integer",
            default: 0
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
        movies: {
            type: "array",
			default: []
        },
        expertMode: {
            type: "boolean",
            default: false
        }
    },
    icon: Cinemarathons,
    edit: Edit,
});