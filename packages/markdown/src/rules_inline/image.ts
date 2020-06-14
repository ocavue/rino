// Process ![image](<src> "title")

import { isSpace, normalizeReference } from "markdown-it/lib/common/utils"
import Token from "markdown-it/lib/token"

import { StateInline } from "../state_inline"
import { Reference } from "../types"

export function image(state: StateInline, silent: boolean) {
    let code,
        content,
        label,
        labelEnd,
        labelStart,
        pos,
        ref,
        res,
        title,
        start,
        href = "",
        oldPos = state.pos,
        max = state.posMax

    if (state.src.charCodeAt(state.pos) !== 0x21 /* ! */) {
        return false
    }
    if (state.src.charCodeAt(state.pos + 1) !== 0x5b /* [ */) {
        return false
    }

    labelStart = state.pos + 2
    labelEnd = state.helpers.parseLinkLabel(state, state.pos + 1, false)

    // parser failed to find ']', so it's not a valid link
    if (labelEnd < 0) {
        return false
    }

    pos = labelEnd + 1
    if (pos < max && state.src.charCodeAt(pos) === 0x28 /* ( */) {
        //
        // Inline link
        //

        // [link](  <href>  "title"  )
        //        ^^ skipping these spaces
        pos++
        for (; pos < max; pos++) {
            code = state.src.charCodeAt(pos)
            if (!isSpace(code) && code !== 0x0a) {
                break
            }
        }
        if (pos >= max) {
            return false
        }

        // [link](  <href>  "title"  )
        //          ^^^^^^ parsing link destination
        start = pos
        res = state.helpers.parseLinkDestination(state.src, pos, state.posMax)
        if (res.ok) {
            href = state.helpers.normalizeLink(res.str)
            if (state.helpers.validateLink(href)) {
                pos = res.pos
            } else {
                href = ""
            }
        }

        // [link](  <href>  "title"  )
        //                ^^ skipping these spaces
        start = pos
        for (; pos < max; pos++) {
            code = state.src.charCodeAt(pos)
            if (!isSpace(code) && code !== 0x0a) {
                break
            }
        }

        // [link](  <href>  "title"  )
        //                  ^^^^^^^ parsing link title
        res = state.helpers.parseLinkTitle(state.src, pos, state.posMax)
        if (pos < max && start !== pos && res.ok) {
            title = res.str
            pos = res.pos

            // [link](  <href>  "title"  )
            //                         ^^ skipping these spaces
            for (; pos < max; pos++) {
                code = state.src.charCodeAt(pos)
                if (!isSpace(code) && code !== 0x0a) {
                    break
                }
            }
        } else {
            title = ""
        }

        if (pos >= max || state.src.charCodeAt(pos) !== 0x29 /* ) */) {
            state.pos = oldPos
            return false
        }
        pos++
    } else {
        //
        // Link reference
        //
        let references: Record<string, Reference> = state.env.references
        if (!references) {
            return false
        }

        if (pos < max && state.src.charCodeAt(pos) === 0x5b /* [ */) {
            start = pos + 1
            pos = state.helpers.parseLinkLabel(state, pos)
            if (pos >= 0) {
                label = state.src.slice(start, pos++)
            } else {
                pos = labelEnd + 1
            }
        } else {
            pos = labelEnd + 1
        }

        // covers label === '' and label === undefined
        // (collapsed reference link and shortcut reference link respectively)
        if (!label) {
            label = state.src.slice(labelStart, labelEnd)
        }

        ref = references[normalizeReference(label)]
        if (!ref) {
            state.pos = oldPos
            return false
        }
        href = ref.href
        title = ref.title
    }

    //
    // We found the end of the link, and know for a fact it's a valid link;
    // so all that's left to do is to call tokenizer.
    //
    if (!silent) {
        content = state.src.slice(labelStart, labelEnd)

        let tokens: Token[] = state.parse(content)
        let token = state.push("image", "img", 0)
        token.attrs = [
            ["src", href],
            ["alt", ""],
        ]
        token.children = tokens
        token.content = content

        if (title) {
            token.attrs.push(["title", title])
        }
    }

    state.pos = pos
    state.posMax = max
    return true
}
