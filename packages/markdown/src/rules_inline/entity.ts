// Process html entity - &#123;, &#xAF;, &quot;, ...

import entities from "markdown-it/lib/common/entities"
import { fromCodePoint, has, isValidEntityCode } from "markdown-it/lib/common/utils"

import { StateInline } from "../state_inline"

let DIGITAL_RE = /^&#((?:x[a-f0-9]{1,6}|[0-9]{1,7}));/i
let NAMED_RE = /^&([a-z][a-z0-9]{1,31});/i

export function entity(state: StateInline, silent: boolean) {
    let code,
        pos = state.pos,
        max = state.posMax

    if (state.src.charCodeAt(pos) !== 0x26 /* & */) {
        return false
    }

    if (pos + 1 < max) {
        let ch = state.src.charCodeAt(pos + 1)

        if (ch === 0x23 /* # */) {
            let match = DIGITAL_RE.exec(state.src.slice(pos))
            if (match) {
                if (!silent) {
                    code =
                        match[1][0].toLowerCase() === "x"
                            ? parseInt(match[1].slice(1), 16)
                            : parseInt(match[1], 10)
                    state.pending += isValidEntityCode(code)
                        ? fromCodePoint(code)
                        : fromCodePoint(0xfffd)
                }
                state.pos += match[0].length
                return true
            }
        } else {
            let match = NAMED_RE.exec(state.src.slice(pos))
            if (match) {
                if (has(entities, match[1])) {
                    if (!silent) {
                        state.pending += entities[match[1]]
                    }
                    state.pos += match[0].length
                    return true
                }
            }
        }
    }

    if (!silent) {
        state.pending += "&"
    }
    state.pos++
    return true
}
