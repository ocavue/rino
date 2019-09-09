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
        let { $cursor } = state.selection
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

        let tr: Transaction = state.tr.setBlockType(
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
    getAttrs: (match: string[]) => { [name: string]: string },
    transact?: (match: string[], tr: Transaction) => Transaction,
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
            const match = (nodeBefore.text || "").match(regex)
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
                    .delete(start, end)
                    .setBlockType(start, start, nodeType, getAttrs(match))
                if (transact) {
                    tr = transact(match, tr)
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
    const mac = typeof navigator != "undefined" ? /Mac/.test(navigator.platform) : false

    let keys: Record<string, Command> = {}
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
        let br = type,
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
        let hr = type
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
            buildBlockEnterKeymapBindings(
                /^```([a-zA-Z]*)?$/,
                schema.nodes.rinoCodeBlock,
                match => ({ language: match[1] }),
            ),
        ),
        keymap(buildKeymapBindings()),
        keymap(baseKeymapBindings),
    ]
}
