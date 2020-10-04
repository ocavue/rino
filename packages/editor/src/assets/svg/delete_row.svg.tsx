import * as React from "react"

function SvgComponent(props) {
    return (
        <svg width={24} height={24} viewBox="0 0 24 24" {...props}>
            <defs>
                <clipPath id="prefix__b">
                    <path fill="none" d="M0 0h24v24H0z" />
                </clipPath>
                <clipPath id="prefix__a">
                    <path d="M0 0h24v24H0z" />
                </clipPath>
            </defs>
            <g clipPath="url(#prefix__a)">
                <g data-name="Group 4" clipPath="url(#prefix__b)">
                    <path
                        data-name="Subtraction 2"
                        d="M5 6h14a2.122 2.122 0 012 2.222v5.556A2.122 2.122 0 0119 16h-2v-2h2V8H5v6h2v2H5a2.122 2.122 0 01-2-2.222V8.222A2.122 2.122 0 015 6z"
                        fill="#f400f4"
                    />
                    <path
                        d="M16.243 12.162l-1.4-1.4L12 13.59l-2.843-2.828-1.4 1.4L10.6 14.99l-2.843 2.828 1.4 1.4L12 16.39l2.843 2.828 1.4-1.4L13.4 14.99z"
                        fillRule="evenodd"
                        fill="#f400f4"
                        data-name="Group 1"
                    />
                </g>
            </g>
        </svg>
    )
}

export default SvgComponent
