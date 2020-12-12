type TableMenuSvg = React.FC<{
    alt?: string
    width?: string
    height?: string
}>

export type TableMenuSvgs = Record<
    "AddColumnAfter" | "AddColumnBefore" | "AddRowAfter" | "AddRowBefore" | "DeleteColumn" | "DeleteRow",
    TableMenuSvg
>
