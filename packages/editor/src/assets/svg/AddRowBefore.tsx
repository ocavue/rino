/* Copyright (c) 2020-present ocavue@gmail.com */

import * as React from "react"

function SvgAddRowBefore(props: React.SVGProps<SVGSVGElement>) {
    return (
        <svg width={24} height={24} fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
            <g fill="#000" fillOpacity={0.54}>
                <path d="M19 20H5v-2h14M19 18h2a2 2 0 01-2 2v-2zM5 8H3a2 2 0 012-2v2zM19 8V6a2 2 0 012 2h-2zM16 8V6h-3V3h-2v3H8v2h3v3h2V8h3zM19 14H5v-2h14M6 8H5V6h1M19 8h-1V6h1M21 18h-2V8h2M5 18H3V8h2M5 18v2a2 2 0 01-2-2h2z" />
            </g>
        </svg>
    )
}

export default SvgAddRowBefore
