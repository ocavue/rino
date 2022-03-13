import {
    TableCellExtension as BaseTableCellExtension,
    TableExtension as BaseTableExtension,
    TableHeaderCellExtension as BaseTableHeaderCellExtension,
    TableRowExtension as BaseTableRowExtension,
} from "@remirror/extension-tables"

export class TableExtension extends BaseTableExtension {
    get name() {
        return "table" as const
    }
}

export class TableCellExtension extends BaseTableCellExtension {
    get name() {
        return "tableCell" as const
    }
}

export class TableHeaderCellExtension extends BaseTableHeaderCellExtension {
    get name() {
        return "tableHeaderCell" as const
    }
}

export class TableRowExtension extends BaseTableRowExtension {
    get name() {
        return "tableRow" as const
    }
}
