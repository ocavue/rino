import { keymap } from "prosemirror-keymap"
import { baseKeymap as baseKeymapBindings } from "prosemirror-commands"
import { NodeType } from "prosemirror-model"
import { wrapIn, setBlockType, chainCommands, toggleMark, exitCode, joinUp, joinDown, lift, selectParentNode } from "prosemirror-commands"
import { wrapInList, splitListItem, liftListItem, sinkListItem } from "prosemirror-schema-list"
import { undo, redo } from "prosemirror-history"
import { undoInputRule } from "prosemirror-inputrules"
import { Plugin, EditorState, Transaction, TextSelection } from "prosemirror-state"

import { schema } from '../markdown/index'

type Command = (state: EditorState, dispatch?: (tr: Transaction) => void) => boolean | null

function buildBlockEnterKeymapBindings(
    regex: RegExp,
    nodeType: NodeType,
    getAttrs: (match: string[]) => { [name: string]: string },
    transact?: (match: string[], tr: Transaction) => Transaction,
): { [key: string]: Command } {
    // https://github.com/ProseMirror/prosemirror/issues/374#issuecomment-224514332
    // https://discuss.prosemirror.net/t/trigger-inputrule-on-enter/1118/4
    return {
        'Enter': (state, dispatch) => {
            // Some code is copy from ./node_modules/prosemirror-inputrules/src/inputrules.js
            if (!(state.selection instanceof TextSelection)) {
                return false;
            }
            const { nodeBefore } = state.selection.$from;
            if (!nodeBefore || !nodeBefore.isText) {
                return false;
            }
            const cursor = state.selection.$cursor
            const match = nodeBefore.text.match(regex);
            if (match) {
                const [start, end] = [cursor.pos - match[0].length, cursor.pos]
                // copy from `textblockTypeInputRule`
                const $start = state.doc.resolve(start);
                if (!$start.node(-1).canReplaceWith($start.index(-1), $start.indexAfter(-1), nodeType)) {
                    return null
                }

                let tr: Transaction = state.tr.delete(start, end).setBlockType(start, start, nodeType, getAttrs(match))
                if (transact) {
                    tr = transact(match, tr)
                }
                dispatch(tr)
                return true;
            }
            return false;
        },
    }
}

function buildKeymapBindings(): { [key: string]: Command } {
    const mac = typeof navigator != "undefined" ? /Mac/.test(navigator.platform) : false

    let keys = {}, type
    function bind(key, cmd): void {
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

    if (type = schema.marks.strong)
        bind("Mod-b", toggleMark(type))
    if (type = schema.marks.em)
        bind("Mod-i", toggleMark(type))
    if (type = schema.marks.code)
        bind("Mod-`", toggleMark(type))

    if (type = schema.nodes.rinoBulletList)
        bind("Shift-Ctrl-8", wrapInList(type))
    if (type = schema.nodes.rinoOrderedList)
        bind("Shift-Ctrl-9", wrapInList(type))
    if (type = schema.nodes.rinoBlockquote)
        bind("Ctrl->", wrapIn(type))
    if (type = schema.nodes.rinoHardBreak) {
        let br = type, cmd = chainCommands(exitCode, (state, dispatch) => {
            dispatch(state.tr.replaceSelectionWith(br.create()).scrollIntoView())
            return true
        })
        bind("Mod-Enter", cmd)
        bind("Shift-Enter", cmd)
        if (mac) bind("Ctrl-Enter", cmd)
    }
    if (type = schema.nodes.rinoListItem) {
        bind("Enter", splitListItem(type))
        bind("Mod-[", liftListItem(type))
        bind("Mod-]", sinkListItem(type))
    }
    if (type = schema.nodes.paragraph)
        bind("Shift-Ctrl-0", setBlockType(type))
    if (type = schema.nodes.rinoCodeBlock)
        bind("Shift-Ctrl-\\", setBlockType(type))
    if (type = schema.nodes.heading)
        for (let i = 1; i <= 6; i++) bind("Shift-Ctrl-" + i, setBlockType(type, { level: i }))
    if (type = schema.nodes.rinoHorizontalRule) {
        let hr = type
        bind("Mod-_", (state, dispatch) => {
            dispatch(state.tr.replaceSelectionWith(hr.create()).scrollIntoView())
            return true
        })
    }

    return keys
}

export function buildKeymaps(): Plugin[] {
    return [
        keymap(buildBlockEnterKeymapBindings(
            /^```([a-zA-Z]*)?$/,
            schema.nodes.rinoCodeBlock,
            match => ({ language: match[1] }),
        )),
        keymap(buildKeymapBindings()),
        keymap(baseKeymapBindings),
    ]
}
