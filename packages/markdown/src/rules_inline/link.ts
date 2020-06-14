// Process [link](<to> "stuff") and [foo]: /url "title"
// https://spec.commonmark.org/0.29/#links

import { isSpace } from "markdown-it/lib/common/utils"

import { StateInline } from "../state_inline"
import { Token } from "../token"

type ProcessLinkResult =
    | false
    | {
          linkStart: number
          linkLabelStart: number
          linkLabelEnd: number
          linkDestinationStart: number
          linkDestinationEnd: number
          linkTitleStart: number
          linkTitleEnd: number
          linkEnd: number

          href: string
          title: string
      }

function processLink(state: StateInline): ProcessLinkResult {
    // Process [link](<to> "stuff")

    /*
        ┌───────────────────────────────────── linkStart
        |┌──────────────────────────────────── linkLabelStart
        ||    ┌─────────────────────────────── linkLabelEnd
        ||    |    ┌────────────────────────── linkDestinationStart
        ||    |    |     ┌──────────────────── linkDestinationEnd
        ||    |    |     |  ┌───────────────── linkTitleStart
        ||    |    |     |  |      ┌────────── linkTitleEnd
        ||    |    |     |  |      |   ┌────── linkEnd
        ||    |    |     |  |      |   |
        ||    |    |     |  |      |   |
        [label](   <href>   "title"   )

    */

    const max = state.posMax
    let start = state.pos

    let linkStart,
        linkLabelStart,
        linkLabelEnd,
        linkDestinationStart,
        linkDestinationEnd,
        linkTitleStart,
        linkTitleEnd,
        linkEnd: number
    let href = ""
    let title = ""

    if (state.src.charCodeAt(state.pos) !== 0x5b /* [ */) {
        return false
    }

    linkStart = state.pos
    linkLabelStart = state.pos + 1
    linkLabelEnd = state.helpers.parseLinkLabel(state, state.pos, true)

    // parser failed to find ']', so it's not a valid link
    if (linkLabelEnd < 0) {
        return false
    }

    let pos = linkLabelEnd + 1
    if (pos < max && state.src.charCodeAt(pos) === 0x28 /* ( */) {
        //
        // Inline link
        //

        // might have found a valid shortcut link, disable reference parsing
        // parseReference = false

        // [link](  <href>  "title"  )
        //        ^^ skipping these spaces
        pos++
        for (; pos < max; pos++) {
            let code = state.src.charCodeAt(pos)
            if (!isSpace(code) && code !== 0x0a) {
                break
            }
        }
        if (pos >= max) {
            return false
        }

        // [link](  <href>  "title"  )
        //          ^^^^^^ parsing link destination
        linkDestinationStart = linkDestinationEnd = pos
        let res = state.helpers.parseLinkDestination(state.src, pos, state.posMax)
        if (res.ok) {
            href = state.helpers.normalizeLink(res.str)
            if (state.helpers.validateLink(href)) {
                pos = res.pos
                linkDestinationEnd = res.pos
            } else {
                href = ""
            }
        }

        // [link](  <href>  "title"  )
        //                ^^ skipping these spaces
        start = pos
        for (; pos < max; pos++) {
            let code = state.src.charCodeAt(pos)
            if (!isSpace(code) && code !== 0x0a) {
                break
            }
        }

        // [link](  <href>  "title"  )
        //                  ^^^^^^^ parsing link title
        linkTitleStart = linkTitleEnd = pos
        res = state.helpers.parseLinkTitle(state.src, pos, state.posMax)
        if (pos < max && start !== pos && res.ok) {
            title = res.str
            pos = res.pos
            linkTitleEnd = res.pos

            // [link](  <href>  "title"  )
            //                         ^^ skipping these spaces
            for (; pos < max; pos++) {
                let code = state.src.charCodeAt(pos)
                if (!isSpace(code) && code !== 0x0a) {
                    break
                }
            }
        } else {
            title = ""
        }

        if (pos >= max || state.src.charCodeAt(pos) !== 0x29 /* ) */) {
            // parsing a valid shortcut link failed, fallback to reference
            // parseReference = true
        }
        pos++
        linkEnd = pos

        return {
            linkStart,
            linkLabelStart,
            linkLabelEnd,
            linkDestinationStart,
            linkDestinationEnd,
            linkTitleStart,
            linkTitleEnd,
            linkEnd,

            href,
            title,
        }
    }
    return false
}

export function link(state: StateInline, silent: boolean) {
    let max = state.posMax

    let res: ProcessLinkResult = processLink(state)
    if (!res) return false
    const {
        linkLabelStart,
        linkLabelEnd,
        linkDestinationStart,
        linkDestinationEnd,
        linkTitleStart,
        linkTitleEnd,
        linkEnd,
        href,
        title,
    } = res

    // TODO
    // if (parseReference) {
    //     //
    //     // Link reference
    //     //
    //     let references: Record<string, Reference> = state.env.references
    //     if (!references) {
    //         return false
    //     }

    //     if (pos < max && state.src.charCodeAt(pos) === 0x5b /* [ */) {
    //         start = pos + 1
    //         pos = state.helpers.parseLinkLabel(state, pos)
    //         if (pos >= 0) {
    //             label = state.src.slice(start, pos++)
    //         } else {
    //             pos = linkLabelStart + 1
    //         }
    //     } else {
    //         pos = linkLabelEnd + 1
    //     }

    //     // covers label === '' and label === undefined
    //     // (collapsed reference link and shortcut reference link respectively)
    //     if (!label) {
    //         label = state.src.slice(linkLabelStart, linkLabelEnd)
    //     }

    //     ref = references[normalizeReference(label)]
    //     if (!ref) {
    //         state.pos = oldPos
    //         return false
    //     }
    //     href = ref.href
    //     title = ref.title
    // }

    //
    // We found the end of the link, and know for a fact it's a valid link;
    // so all that's left to do is to call tokenizer.
    //
    if (!silent) {
        state.pos = linkLabelStart
        state.posMax = linkLabelEnd

        let token: Token

        token = state.push("link_label_open", "span", 1)
        token.content = "["

        // the content inside the link label
        state.parser.tokenize(state)

        token = state.push("link_label_close", "span", 0)
        token.content = "]"

        token = state.push("link_parenthesis_open", "span", 0)
        token.content = "("

        token = state.push("link_space", "span", 0)
        token.content = state.src.slice(linkLabelEnd + 2, linkDestinationStart)

        token = state.push("link_destination", "span", 0)
        token.content = state.src.slice(linkDestinationStart, linkDestinationEnd)
        token.attrs = token.attrs || []
        token.attrs.push(["href", href])

        token = state.push("link_space", "span", 0)
        token.content = state.src.slice(linkDestinationEnd, linkTitleStart)

        token = state.push("link_title", "span", 0)
        token.content = state.src.slice(linkTitleStart, linkTitleEnd)
        token.attrs = token.attrs || []
        token.attrs.push(["title", title])

        token = state.push("link_space", "span", 0)
        token.content = state.src.slice(linkTitleEnd, linkEnd - 1)

        token = state.push("link_parenthesis_close", "a", -1)
        token.content = ")"
    }

    state.pos = linkEnd
    state.posMax = max
    return true
}
