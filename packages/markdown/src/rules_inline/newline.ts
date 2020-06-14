// Proceess '\n'

import { isSpace } from "markdown-it/lib/common/utils"

import { StateInline } from "../state_inline"

export function newline(state: StateInline, silent: boolean) {
    let pos = state.pos

    if (state.src.charCodeAt(pos) !== 0x0a /* \n */) {
        return false
    }

    let pmax = state.pending.length - 1
    let max = state.posMax

    // '  \n' -> hardbreak
    // Lookup in pending chars is bad practice! Don't copy to other rules!
    // Pending string is stored in concat mode, indexed lookups will cause
    // convertion to flat mode.
    if (!silent) {
        if (pmax >= 0 && state.pending.charCodeAt(pmax) === 0x20) {
            if (pmax >= 1 && state.pending.charCodeAt(pmax - 1) === 0x20) {
                state.pending = state.pending.replace(/ +$/, "")
                state.push("hardbreak", "br", 0)
            } else {
                state.pending = state.pending.slice(0, -1)
                state.push("softbreak", "br", 0)
            }
        } else {
            state.push("softbreak", "br", 0)
        }
    }

    pos++

    // skip heading spaces for next line
    while (pos < max && isSpace(state.src.charCodeAt(pos))) {
        pos++
    }

    state.pos = pos
    return true
}
