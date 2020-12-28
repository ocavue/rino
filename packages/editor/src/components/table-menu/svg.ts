import AddColumnAfter from "../../assets/svg/AddColumnAfter"
import AddColumnBefore from "../../assets/svg/AddColumnBefore"
import AddRowAfter from "../../assets/svg/AddRowAfter"
import AddRowBefore from "../../assets/svg/AddRowBefore"
import DeleteColumn from "../../assets/svg/DeleteColumn"
import DeleteRow from "../../assets/svg/DeleteRow"

type TableMenuSvg = React.FC<{
    alt?: string
    width?: string
    height?: string
}>

export type TableMenuSvgs = Record<
    "AddColumnAfter" | "AddColumnBefore" | "AddRowAfter" | "AddRowBefore" | "DeleteColumn" | "DeleteRow",
    TableMenuSvg
>

export const tableMenuSvgs: TableMenuSvgs = {
    AddColumnBefore,
    AddColumnAfter,
    AddRowAfter,
    AddRowBefore,
    DeleteColumn,
    DeleteRow,
}
