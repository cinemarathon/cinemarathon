import { registerBlockType } from "@wordpress/blocks"

import { __ } from "@wordpress/i18n"

import { Cinemarathon } from "../icons"
import Edit from "./edit"

registerBlockType("cinemarathon/marathon", {
    apiVersion: 2,
    title: __( "Cinemarathon", "cinemarathon" ),
    description: __( "Displays a list of movies you plan to watch along with a few options to add more fun to the fun.", "cinemarathon" ),
    category: "cinemarathon",
    attributes: {
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
			default: [
                {
                    watched: true,
                    rewatch: true,
                    available: true,
                    bonus: false,
                    title: "1964 - A Fistful of Dollars"
                },
                {
                    watched: true,
                    rewatch: true,
                    available: true,
                    bonus: false,
                    title: "1965 - For a Few Dollars More"
                },
                {
                    watched: false,
                    rewatch: true,
                    available: true,
                    bonus: false,
                    title: "1966 - The Good, the Bad and the Ugly"
                },
                {
                    watched: false,
                    rewatch: false,
                    available: false,
                    bonus: false,
                    title: "1968 - Hang 'Em High"
                },
                {
                    watched: false,
                    rewatch: true,
                    available: true,
                    bonus: true,
                    title: "1958 - Lafayette Escadrille"
                },
            ]
        }
    },
    icon: Cinemarathon,
    edit: Edit,
});