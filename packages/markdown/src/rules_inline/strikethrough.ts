// ~~strike through~~
//

import { Delimiter, StateInline } from "../state_inline"

// Insert each marker as a separate text token, and add it to delimiter list
//
export function strikethrough(state: StateInline, silent: boolean) {
    if (silent) {
        return false
    }

    let start = state.pos,
        marker = state.src.charCodeAt(start)

    if (marker !== 0x7e /* ~ */) {
        return false
    }

    let scanned = state.scanDelims(state.pos, true)
    let len = scanned.length
    let ch = String.fromCharCode(marker)

    if (len < 2) {
        return false
    }

    if (len % 2) {
        let token = state.push("text", "", 0)
        token.content = ch
        len--
    }

    for (let i = 0; i < len; i += 2) {
        let token = state.push("text", "", 0)
        token.content = ch + ch

        state.delimiters.push({
            marker: marker,
            length: 0, // disable "rule of 3" length checks meant for emphasis
            jump: i,
            token: state.tokens.length - 1,
            end: -1,
            open: scanned.can_open,
            close: scanned.can_close,
        })
    }

    state.pos += scanned.length

    return true
}

function postProcess(state: StateInline, delimiters: Delimiter[]) {
    let startDelim,
        endDelim,
        token,
        loneMarkers = [],
        max = delimiters.length

    for (let i = 0; i < max; i++) {
        startDelim = delimiters[i]

        if (startDelim.marker !== 0x7e /* ~ */) {
            continue
        }

        if (startDelim.end === -1) {
            continue
        }

        endDelim = delimiters[startDelim.end]

        token = state.tokens[startDelim.token]
        token.type = "s_open"
        token.tag = "s"
        token.nesting = 1
        token.markup = "~~"
        token.content = ""

        token = state.tokens[endDelim.token]
        token.type = "s_close"
        token.tag = "s"
        token.nesting = -1
        token.markup = "~~"
        token.content = ""

        if (
            state.tokens[endDelim.token - 1].type === "text" &&
            state.tokens[endDelim.token - 1].content === "~"
        ) {
            loneMarkers.push(endDelim.token - 1)
        }
    }

    // If a marker sequence has an odd number of characters, it's splitted
    // like this: `~~~~~` -> `~` + `~~` + `~~`, leaving one marker at the
    // start of the sequence.
    //
    // So, we have to move all those markers after subsequent s_close tags.
    //
    while (loneMarkers.length) {
        let i = loneMarkers.pop() as number
        let j = i + 1

        while (j < state.tokens.length && state.tokens[j].type === "s_close") {
            j++
        }

        j--

        if (i !== j) [state.tokens[i], state.tokens[j]] = [state.tokens[j], state.tokens[i]]
    }
}

// Walk through delimiter list and replace text tokens with tags
//
export function postStrikethrough(state: StateInline) {
    let tokens_meta = state.tokens_meta,
        max = state.tokens_meta.length

    postProcess(state, state.delimiters)

    for (let curr = 0; curr < max; curr++) {
        let delimiters = tokens_meta[curr]?.delimiters
        if (delimiters) {
            postProcess(state, delimiters)
        }
    }
}
