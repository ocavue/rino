import * as React from "react"

function SvgAddColumnBefore(props: React.SVGProps<SVGSVGElement>) {
    return (
        <svg width={24} height={24} fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
            <g fill="#000" fillOpacity={0.54}>
                <path d="M20 5v14h-2V5M18 5V3a2 2 0 012 2h-2zM8 19v2a2 2 0 01-2-2h2zM8 5H6a2 2 0 012-2v2zM8 8H6v3H3v2h3v3h2v-3h3v-2H8V8zM14 5v14h-2V5M8 18v1H6v-1M8 5v1H6V5M18 3v2H8V3M18 19v2H8v-2M18 19h2a2 2 0 01-2 2v-2z" />
            </g>
        </svg>
    )
}

export default SvgAddColumnBefore
