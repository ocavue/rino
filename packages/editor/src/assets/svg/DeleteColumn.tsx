import * as React from "react"

function SvgDeleteColumn(props: React.SVGProps<SVGSVGElement>) {
    return (
        <svg width={24} height={24} fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
            <path
                d="M6 19V5a2.122 2.122 0 012.222-2h5.556A2.122 2.122 0 0116 5v2h-2V5H8v14h6v-2h2v2a2.122 2.122 0 01-2.222 2H8.222A2.122 2.122 0 016 19z"
                fill="#000"
                fillOpacity={0.54}
            />
            <path
                opacity={0.54}
                fillRule="evenodd"
                clipRule="evenodd"
                d="M12.162 7.757l-1.4 1.4L13.59 12l-2.828 2.843 1.4 1.4L14.99 13.4l2.828 2.843 1.4-1.4L16.39 12l2.828-2.843-1.4-1.4L14.99 10.6l-2.828-2.843z"
                fill="#000"
            />
        </svg>
    )
}

export default SvgDeleteColumn
