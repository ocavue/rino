import { Strategy } from "@floating-ui/react-dom"
import React from "react"

import { TableMenu } from "./TableMenu"

type TableMenuButtonProps = {
    x: number | null
    y: number | null
    floating: (node: HTMLElement | null) => void
    strategy: Strategy
}

export const TableMenuButton: React.FC<TableMenuButtonProps> = ({ x, y, floating, strategy }) => {
    const [event, setEvent] = React.useState<React.MouseEvent | null>(null)

    const handleClick = (event: React.MouseEvent) => {
        setEvent(event)
    }

    const handleClose = () => {
        setEvent(null)
    }

    return (
        <>
            <button
                ref={floating}
                style={{
                    zIndex: 10000,
                    position: strategy,
                    top: y ?? "",
                    left: x ?? "",
                    background: "lightyellow",
                    borderRadius: "4px",
                }}
                onClick={handleClick}
            >
                ...
            </button>
            <TableMenu handleClose={handleClose} event={event} />
        </>
    )
}
