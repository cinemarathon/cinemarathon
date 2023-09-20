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
        movies: {
            type: "array",
			default: [
                {
                    watched: true,
                    rewatch: true,
                    available: true,
                    title: "Pour une poignée de dollars",
                    tmdb_id: ""
                },
                {
                    watched: true,
                    rewatch: true,
                    available: true,
                    title: "Et pour quelques dollars de plus",
                    tmdb_id: ""
                },
                {
                    watched: false,
                    rewatch: true,
                    available: true,
                    title: "Le Bon, la Brute et le Truand",
                    tmdb_id: ""
                },
                {
                    watched: false,
                    rewatch: false,
                    available: false,
                    title: "Pendez-les haut et court",
                    tmdb_id: ""
                }
            ]
        }
    },
    icon: Cinemarathon,
    edit: Edit,
});