import * as React from "react"

function SvgAddRowAfter(props: React.SVGProps<SVGSVGElement>) {
    return (
        <svg width={24} height={24} fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
            <g fill="#000" fillOpacity={0.54}>
                <path d="M5 4h14v2H5M5 6H3a2 2 0 012-2v2zM19 16h2a2 2 0 01-2 2v-2zM5 16v2a2 2 0 01-2-2h2zM8 16v2h3v3h2v-3h3v-2h-3v-3h-2v3H8zM5 10h14v2H5M18 16h1v2h-1M5 16h1v2H5M3 6h2v10H3M19 6h2v10h-2M19 6V4a2 2 0 012 2h-2z" />
            </g>
        </svg>
    )
}

export default SvgAddRowAfter
