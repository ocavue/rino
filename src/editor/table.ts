import { DecorationSet, Decoration, EditorView } from "prosemirror-view"
import { EditorState, Plugin, PluginSpec, Transaction } from "prosemirror-state"
import { Node } from "prosemirror-model"
import {
    addColumnAfter,
    addColumnBefore,
    addRowAfter,
    addRowBefore,
    deleteColumn,
    deleteRow,
    selectionCell,
    // deleteTable, // TODO: use deleteTable
} from "prosemirror-tables"

import { findParentNode } from "./utils"

import addColumnBeforeSvg from "../assets/add_column_before.svg"
import addColumnAfterSvg from "../assets/add_column_after.svg"
import addRowBeforeSvg from "../assets/add_row_before.svg"
import addRowAfterSvg from "../assets/add_row_after.svg"
import deleteColumnSvg from "../assets/delete_column.svg"
import deleteRowSvg from "../assets/delete_row.svg"

const MENU_ID = "rino-table-menu"
type Command = (state: EditorState, dispatch: (tr: Transaction) => void) => boolean

function isSelectingTableCell(state: EditorState): Node | null {
    if (
        state.selection.$from.parent.type.name === "rinoTableCell" &&
        state.selection.$to.parent.type.name === "rinoTableCell"
    ) {
        let fromCell: Node = state.selection.$from.parent
        let toCell: Node = state.selection.$to.parent
        if (fromCell === toCell) {
            return fromCell
        }
    }
    return null
}

class TableMenuPluginSpec implements PluginSpec {
    private editorView?: EditorView

    private buildMenuOption(id: string, svg: string, command: Command): HTMLButtonElement {
        let button = document.createElement("button")
        button.onclick = () => {
            console.debug(`Table menu button '${id}' been clicked`)
            if (this.editorView) command(this.editorView.state, this.editorView.dispatch)
        }
        button.id = id
        button.setAttribute("data-testid", id)
        let icon = document.createElement("img")
        icon.src = svg
        button.appendChild(icon)
        return button
    }

    public props = {
        decorations: (state: EditorState) => {
            if (!isSelectingTableCell(state)) return null

            let parent = findParentNode(
                state.selection.$from,
                node => node.type.name === "rinoTable",
            )
            if (!parent) return null

            let view = this.editorView
            if (!view) return null

            let { pos: tablePos } = parent

            let menu = document.getElementById(MENU_ID)

            if (!menu) {
                menu = document.createElement("div")
                menu.className = "table-menu"
                menu.id = MENU_ID

                const options: [string, string, Command][] = [
                    ["add-row-before", addRowBeforeSvg, addRowBefore],
                    ["add-row-after", addRowAfterSvg, addRowAfter],
                    ["add-column-before", addColumnBeforeSvg, addColumnBefore],
                    ["add-column-after", addColumnAfterSvg, addColumnAfter],
                    ["delete-row", deleteRowSvg, deleteRow],
                    ["delete-column", deleteColumnSvg, deleteColumn],
                ]
                for (const [svg, command, id] of options) {
                    menu.appendChild(this.buildMenuOption(svg, command, id))
                }
            }
            menu.style.bottom = `0px`
            let deco = Decoration.widget(tablePos, menu)
            return DecorationSet.create(state.doc, [deco])
        },
    }

    public view(view: EditorView) {
        this.editorView = view
        return {
            update: () => {},
        }
    }
}

export const tableMenuPlugin = new Plugin(new TableMenuPluginSpec())

export const tableHeigthlightPlugin = new Plugin({
    props: {
        decorations: (state: EditorState) => {
            let cell = isSelectingTableCell(state)
            if (!cell) {
                return null
            }

            let $cell = selectionCell(state)
            if (!$cell) {
                return null
            }
            let nodeStart: number = $cell.pos
            let nodeEnd: number = nodeStart + cell.nodeSize
            return DecorationSet.create(state.doc, [
                Decoration.node(nodeStart, nodeEnd, {
                    // class: "selectedCell", // `selectedCell` will make text color lighter, which will reduce user's visual concentration.
                    style: "background: rgba(200, 200, 255, 0.4)",
                }),
            ])
        },
    },
})
