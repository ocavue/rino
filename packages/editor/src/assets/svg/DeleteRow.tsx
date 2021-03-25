/* Copyright (c) 2020-present ocavue@gmail.com */

import * as React from "react"

function SvgDeleteRow(props: React.SVGProps<SVGSVGElement>) {
    return (
        <svg width={24} height={24} fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
            <path
                d="M5 6h14a2.122 2.122 0 012 2.222v5.556A2.122 2.122 0 0119 16h-2v-2h2V8H5v6h2v2H5a2.122 2.122 0 01-2-2.222V8.222A2.122 2.122 0 015 6z"
                fill="#000"
                fillOpacity={0.54}
            />
            <path
                opacity={0.54}
                fillRule="evenodd"
                clipRule="evenodd"
                d="M16.243 12.162l-1.4-1.4L12 13.59l-2.843-2.828-1.4 1.4L10.6 14.99l-2.843 2.828 1.4 1.4L12 16.39l2.843 2.828 1.4-1.4L13.4 14.99l2.843-2.828z"
                fill="#000"
            />
        </svg>
    )
}

export default SvgDeleteRow
