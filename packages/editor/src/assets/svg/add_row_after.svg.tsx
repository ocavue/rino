import * as React from "react"

function SvgComponent(props) {
    return (
        <svg width={24} height={24} viewBox="0 0 24 24" {...props}>
            <defs>
                <clipPath id="prefix__clip-path">
                    <path fill="none" d="M0 0h24v24H0z" />
                </clipPath>
                <clipPath id="prefix__clip-add_row_after">
                    <path d="M0 0h24v24H0z" />
                </clipPath>
                <style>{".prefix__cls-4{fill:#f400f4}"}</style>
            </defs>
            <g id="prefix__add_row_after" clipPath="url(#prefix__clip-add_row_after)">
                <g id="prefix__Component" clipPath="url(#prefix__clip-path)">
                    <g id="prefix__Group_3" data-name="Group 3">
                        <path
                            id="prefix__Path_10"
                            data-name="Path 10"
                            className="prefix__cls-4"
                            d="M3 6h14v2H3"
                            transform="translate(2 -2)"
                        />
                        <path
                            id="prefix__Intersection_1"
                            data-name="Intersection 1"
                            className="prefix__cls-4"
                            d="M-1-1v-2a2 2 0 012 2z"
                            transform="rotate(-90 5.5 -.5)"
                        />
                        <path
                            id="prefix__Intersection_3"
                            data-name="Intersection 3"
                            className="prefix__cls-4"
                            d="M-1-1v-2a2 2 0 012 2z"
                            transform="rotate(90 .5 17.5)"
                        />
                        <path
                            id="prefix__Intersection_4"
                            data-name="Intersection 4"
                            className="prefix__cls-4"
                            d="M-1-1v-2a2 2 0 012 2z"
                            transform="rotate(180 2 7.5)"
                        />
                        <path
                            id="prefix__Path_2"
                            data-name="Path 2"
                            className="prefix__cls-4"
                            d="M6 13v2h3v3h2v-3h3v-2h-3v-3H9v3z"
                            transform="translate(2 3)"
                        />
                        <path
                            id="prefix__Path_3"
                            data-name="Path 3"
                            className="prefix__cls-4"
                            d="M3 6h14v2H3"
                            transform="translate(2 4)"
                        />
                        <path
                            id="prefix__Path_8"
                            data-name="Path 8"
                            className="prefix__cls-4"
                            d="M4 6h1v2H4"
                            transform="translate(14 10)"
                        />
                        <path
                            id="prefix__Path_9"
                            data-name="Path 9"
                            className="prefix__cls-4"
                            d="M3 6h1v2H3"
                            transform="translate(2 10)"
                        />
                        <path
                            id="prefix__Path_11"
                            data-name="Path 11"
                            className="prefix__cls-4"
                            d="M3 6h2v10H3"
                        />
                        <path
                            id="prefix__Path_17"
                            data-name="Path 17"
                            className="prefix__cls-4"
                            d="M3 6h2v10H3"
                            transform="translate(16)"
                        />
                        <path
                            id="prefix__Intersection_5"
                            data-name="Intersection 5"
                            className="prefix__cls-4"
                            d="M-1-1v-2a2 2 0 012 2z"
                            transform="translate(20 7)"
                        />
                    </g>
                </g>
            </g>
        </svg>
    )
}

export default SvgComponent
