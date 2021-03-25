/* Copyright (c) 2020-present ocavue@gmail.com */

import * as React from "react"

function SvgAddColumnAfter(props: React.SVGProps<SVGSVGElement>) {
    return (
        <svg width={24} height={24} fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
            <g fill="#000" fillOpacity={0.54}>
                <path d="M4 19V5h2v14M6 19v2a2 2 0 01-2-2h2zM16 5V3a2 2 0 012 2h-2zM16 19h2a2 2 0 01-2 2v-2zM16 16h2v-3h3v-2h-3V8h-2v3h-3v2h3v3zM10 19V5h2v14M16 6V5h2v1M16 19v-1h2v1M6 21v-2h10v2M6 5V3h10v2M6 5H4a2 2 0 012-2v2z" />
            </g>
        </svg>
    )
}

export default SvgAddColumnAfter
