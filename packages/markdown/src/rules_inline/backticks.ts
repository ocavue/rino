// Parse backticks

import { StateInline } from "../state_inline"

export function backticks(state: StateInline, silent: boolean) {
    let pos = state.pos,
        ch = state.src.charCodeAt(pos)

    if (ch !== 0x60 /* ` */) {
        return false
    }

    let start = pos
    pos++
    let max = state.posMax

    while (pos < max && state.src.charCodeAt(pos) === 0x60 /* ` */) {
        pos++
    }

    let marker = state.src.slice(start, pos)

    let matchStart = pos
    let matchEnd = pos

    while ((matchStart = state.src.indexOf("`", matchEnd)) !== -1) {
        matchEnd = matchStart + 1

        while (matchEnd < max && state.src.charCodeAt(matchEnd) === 0x60 /* ` */) {
            matchEnd++
        }

        if (matchEnd - matchStart === marker.length) {
            if (!silent) {
                let token = state.push("code_inline", "code", 0)
                token.markup = marker
                token.content = state.src
                    .slice(pos, matchStart)
                    .replace(/\n/g, " ")
                    .replace(/^ (.+) $/, "$1")
            }
            state.pos = matchEnd
            return true
        }
    }

    if (!silent) {
        state.pending += marker
    }
    state.pos += marker.length
    return true
}
