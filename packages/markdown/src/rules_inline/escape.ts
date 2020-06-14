// Process escaped chars and hardbreaks

import { isSpace } from "markdown-it/lib/common/utils"

import { StateInline } from "../state_inline"

let ESCAPED = Array(256).fill(0)

"\\!\"#$%&'()*+,./:;<=>?@[]^_`{|}~-".split("").forEach(function (ch) {
    ESCAPED[ch.charCodeAt(0)] = 1
})

export function escape(state: StateInline, silent: boolean) {
    let pos = state.pos,
        max = state.posMax

    if (state.src.charCodeAt(pos) !== 0x5c /* \ */) {
        return false
    }

    pos++

    if (pos < max) {
        let ch = state.src.charCodeAt(pos)

        if (ch < 256 && ESCAPED[ch] !== 0) {
            if (!silent) {
                state.pending += state.src[pos]
            }
            state.pos += 2
            return true
        }

        if (ch === 0x0a) {
            if (!silent) {
                state.push("hardbreak", "br", 0)
            }

            pos++
            // skip leading whitespaces from next line
            while (pos < max) {
                ch = state.src.charCodeAt(pos)
                if (!isSpace(ch)) {
                    break
                }
                pos++
            }

            state.pos = pos
            return true
        }
    }

    if (!silent) {
        state.pending += "\\"
    }
    state.pos++
    return true
}
