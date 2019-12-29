import { keymap } from "prosemirror-keymap"
import { baseKeymap as baseKeymapBindings } from "prosemirror-commands"
import { NodeType } from "prosemirror-model"
import {
    wrapIn,
    setBlockType,
    chainCommands,
    toggleMark,
    exitCode,
    joinUp,
    joinDown,
    lift,
    selectParentNode,
} from "prosemirror-commands"
import { wrapInList, splitListItem, liftListItem, sinkListItem } from "prosemirror-schema-list"
import { undo, redo } from "prosemirror-history"
import { undoInputRule } from "prosemirror-inputrules"
import { Plugin, EditorState, Transaction, TextSelection } from "prosemirror-state"
import { EditorView } from "prosemirror-view"

import { schema } from "./schema"

type Command = (state: EditorState, dispatch?: (tr: Transaction) => void) => boolean

const resetBlockTypeBindings: Record<string, Command> = {
    // TODO: Test "Del" key in Windows OS
    Backspace: (state, dispatch, view?: EditorView) => {
        if (!(state.selection instanceof TextSelection)) {
            return false
        }

        // Check if the selection is empty
        if (!state.selection.empty) {
            return false
        }

        // Check if the selection at the start of a textblock
        const { $cursor } = state.selection
        if (!$cursor) {
            return false
        }
        if (view ? !view.endOfTextblock("backward", state) : $cursor.parentOffset > 0) {
            return false
        }

        // Check if the selection at a heading block or a code block
        if (
            $cursor.parent.type.name !== "rinoHeading" &&
            $cursor.parent.type.name !== "rinoCodeBlock"
        ) {
            return false
        }

        const tr: Transaction = state.tr.setBlockType(
            $cursor.pos,
            $cursor.pos,
            schema.nodes.paragraph,
        )
        if (dispatch) {
            dispatch(tr)
        }
        return true
    },
}

function buildBlockEnterKeymapBindings(
    regex: RegExp,
    nodeType: NodeType,
    options: {
        getAttrs?: (match: string[]) => { [name: string]: string }
        transact?: (match: string[], tr: Transaction, start: number, end: number) => Transaction
    },
): { [key: string]: Command } {
    // https://github.com/ProseMirror/prosemirror/issues/374#issuecomment-224514332
    // https://discuss.prosemirror.net/t/trigger-inputrule-on-enter/1118/4
    return {
        Enter: (state, dispatch) => {
            // Some code is copy from prosemirror-inputrules/src/inputrules.js
            if (!(state.selection instanceof TextSelection)) {
                return false
            }
            const { nodeBefore } = state.selection.$from
            if (!nodeBefore || !nodeBefore.isText) {
                return false
            }
            const cursor = state.selection.$cursor
            const match = regex.exec(nodeBefore.text || "")
            if (match && cursor) {
                const [start, end] = [cursor.pos - match[0].length, cursor.pos]
                // copy from `textblockTypeInputRule`
                const $start = state.doc.resolve(start)
                if (
                    !$start
                        .node(-1)
                        .canReplaceWith($start.index(-1), $start.indexAfter(-1), nodeType)
                ) {
                    return false
                }

                let tr: Transaction = state.tr
                if (options.getAttrs) {
                    tr = tr
                        .delete(start, end)
                        .setBlockType(start, start, nodeType, options.getAttrs(match))
                }
                if (options.transact) {
                    tr = options.transact(match, tr, start, end)
                }
                if (dispatch) {
                    // To be able to query whether a command is applicable for a given state, without
                    // actually executing it, the `dispatch` argument is optional—commands should
                    // simply return true without doing anything when they are applicable but no
                    // `dispatch` argument is given
                    // https://prosemirror.net/docs/guide/#commands
                    dispatch(tr)
                }
                return true
            }
            return false
        },
    }
}

function buildKeymapBindings(): { [key: string]: Command } {
    const mac = typeof navigator != "undefined" ? navigator.platform.includes("Mac") : false

    const keys: Record<string, Command> = {}
    let type
    function bind(key: string, cmd: Command): void {
        keys[key] = cmd
    }

    bind("Mod-z", undo)
    bind("Shift-Mod-z", redo)
    bind("Backspace", undoInputRule)
    if (!mac) bind("Mod-y", redo)

    bind("Alt-ArrowUp", joinUp)
    bind("Alt-ArrowDown", joinDown)
    bind("Mod-BracketLeft", lift)
    bind("Escape", selectParentNode)

    if ((type = schema.marks.strong)) bind("Mod-b", toggleMark(type))
    if ((type = schema.marks.em)) bind("Mod-i", toggleMark(type))
    if ((type = schema.marks.code)) bind("Mod-`", toggleMark(type))

    if ((type = schema.nodes.rinoBulletList)) bind("Shift-Ctrl-8", wrapInList(type))
    if ((type = schema.nodes.rinoOrderedList)) bind("Shift-Ctrl-9", wrapInList(type))
    if ((type = schema.nodes.rinoBlockquote)) bind("Ctrl->", wrapIn(type))
    if ((type = schema.nodes.rinoHardBreak)) {
        const br = type,
            cmd = chainCommands(exitCode, (state, dispatch) => {
                if (dispatch) dispatch(state.tr.replaceSelectionWith(br.create()).scrollIntoView())
                return true
            })
        bind("Mod-Enter", cmd)
        bind("Shift-Enter", cmd)
        if (mac) bind("Ctrl-Enter", cmd)
    }
    if ((type = schema.nodes.rinoListItem)) {
        bind("Enter", splitListItem(type))
        bind("Mod-[", liftListItem(type))
        bind("Mod-]", sinkListItem(type))
    }
    if ((type = schema.nodes.paragraph)) bind("Shift-Ctrl-0", setBlockType(type))
    if ((type = schema.nodes.rinoCodeBlock)) bind("Shift-Ctrl-\\", setBlockType(type))
    if ((type = schema.nodes.rinoHeading))
        for (let i = 1; i <= 6; i++) bind("Shift-Ctrl-" + i, setBlockType(type, { level: i }))
    if ((type = schema.nodes.rinoHorizontalRule)) {
        const hr = type
        bind("Mod-_", (state, dispatch) => {
            if (dispatch) dispatch(state.tr.replaceSelectionWith(hr.create()).scrollIntoView())
            return true
        })
    }

    return keys
}

export function buildKeymaps(): Plugin[] {
    return [
        keymap(resetBlockTypeBindings),
        keymap(
            buildBlockEnterKeymapBindings(/^```([a-zA-Z]*)?$/, schema.nodes.rinoCodeBlock, {
                getAttrs: match => ({ language: match[1] }),
            }),
        ),
        keymap(
            buildBlockEnterKeymapBindings(/^\|((?:[^\|]+\|){2,})\s*$/, schema.nodes.rinoTable, {
                transact: (match: string[], tr: Transaction, start: number, end: number) => {
                    const texts = match[1]
                        .split("|")
                        .slice(0, -1) // Remove the empty string at the end
                        .map(text => {
                            text = text.trim()
                            if (!text) text = " " // Prosemirror text doesn't allow empty text
                            return schema.text(text)
                        })
                    const cells = texts.map(text => schema.nodes.rinoTableCell.create(null, text))
                    const row = schema.nodes.rinoTableRow.create(null, cells)
                    const table = schema.nodes.rinoTable.create(null, row)
                    tr = tr.delete(start, end).insert(start, table)
                    return tr
                },
            }),
        ),
        keymap(buildKeymapBindings()),
        keymap(baseKeymapBindings),
    ]
}
