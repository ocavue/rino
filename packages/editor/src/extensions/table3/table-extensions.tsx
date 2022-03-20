import { ApplySchemaAttributes, NodeSpecOverride } from "@remirror/core"
import {
    TableCellExtension as BaseTableCellExtension,
    TableExtension as BaseTableExtension,
    TableHeaderCellExtension as BaseTableHeaderCellExtension,
    TableRowExtension as BaseTableRowExtension,
    TableSchemaSpec,
} from "@remirror/extension-tables"
import { EditorState } from "prosemirror-state"
import { DecorationSet } from "prosemirror-view"

import { createSelectorDecorations } from "./table-selector"

export class TableExtension extends BaseTableExtension {
    get name() {
        return "table" as const
    }

    // TODO: we might not need this
    createNodeSpec(extra: ApplySchemaAttributes, override: NodeSpecOverride): TableSchemaSpec {
        return { ...super.createNodeSpec(extra, override), allowGapCursor: false }
    }

    createDecorations(state: EditorState): DecorationSet {
        return createSelectorDecorations(state, this.store.view)
    }
}

export class TableCellExtension extends BaseTableCellExtension {
    get name() {
        return "tableCell" as const
    }

    createNodeSpec(extra: ApplySchemaAttributes, override: NodeSpecOverride): TableSchemaSpec {
        return { ...super.createNodeSpec(extra, override), allowGapCursor: false }
    }
}

export class TableHeaderCellExtension extends BaseTableHeaderCellExtension {
    get name() {
        return "tableHeaderCell" as const
    }

    createNodeSpec(extra: ApplySchemaAttributes, override: NodeSpecOverride): TableSchemaSpec {
        return { ...super.createNodeSpec(extra, override), allowGapCursor: false }
    }
}

export class TableRowExtension extends BaseTableRowExtension {
    get name() {
        return "tableRow" as const
    }

    createNodeSpec(extra: ApplySchemaAttributes, override: NodeSpecOverride): TableSchemaSpec {
        return { ...super.createNodeSpec(extra, override), allowGapCursor: false }
    }
}
