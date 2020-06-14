// Process html tags

import { HTML_TAG_RE } from "markdown-it/lib/common/html_re"

import { StateInline } from "../state_inline"

function isLetter(ch: number) {
    /*eslint no-bitwise:0*/
    let lc = ch | 0x20 // to lower case
    return lc >= 0x61 /* a */ && lc <= 0x7a /* z */
}

export function htmlInline(state: StateInline, silent: boolean) {
    let pos = state.pos

    if (!state.options.html) {
        return false
    }

    // Check start
    let max = state.posMax
    if (state.src.charCodeAt(pos) !== 0x3c /* < */ || pos + 2 >= max) {
        return false
    }

    // Quick fail on second char
    let ch = state.src.charCodeAt(pos + 1)
    if (ch !== 0x21 /* ! */ && ch !== 0x3f /* ? */ && ch !== 0x2f /* / */ && !isLetter(ch)) {
        return false
    }

    let match = HTML_TAG_RE.exec(state.src.slice(pos))
    if (!match) {
        return false
    }

    if (!silent) {
        let token = state.push("html_inline", "", 0)
        token.content = state.src.slice(pos, pos + match[0].length)
    }
    state.pos += match[0].length
    return true
}
