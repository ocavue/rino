// Process autolinks '<protocol:...>'

import Token from "markdown-it/lib/token"

import { StateInline } from "../state_inline"

const EMAIL_RE = /^<([a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*)>/
const AUTOLINK_RE = /^<([a-zA-Z][a-zA-Z0-9+.\-]{1,31}):([^<>\0-\x2]*)>/

export function autolink(state: StateInline, silent: boolean): boolean {
    let url, fullUrl
    let token: Token
    const pos = state.pos

    if (state.src.charCodeAt(pos) !== 0x3c /* < */) {
        return false
    }

    const tail = state.src.slice(pos)

    if (tail.indexOf(">") < 0) {
        return false
    }

    const linkMatch = AUTOLINK_RE.exec(tail)
    if (linkMatch) {
        url = linkMatch[0].slice(1, -1)
        fullUrl = state.helpers.normalizeLink(url)
        if (!state.helpers.validateLink(fullUrl)) {
            return false
        }

        if (!silent) {
            token = state.push("link_open", "a", 1)
            token.attrs = [["href", fullUrl]]
            token.markup = "autolink"
            token.info = "auto"

            token = state.push("text", "", 0)
            token.content = state.helpers.normalizeLinkText(url)

            token = state.push("link_close", "a", -1)
            token.markup = "autolink"
            token.info = "auto"
        }

        state.pos += linkMatch[0].length
        return true
    }

    const emailMatch = EMAIL_RE.exec(tail)
    if (emailMatch) {
        url = emailMatch[0].slice(1, -1)
        fullUrl = state.helpers.normalizeLink("mailto:" + url)
        if (!state.helpers.validateLink(fullUrl)) {
            return false
        }

        if (!silent) {
            token = state.push("link_open", "a", 1)
            token.attrs = [["href", fullUrl]]
            token.markup = "autolink"
            token.info = "auto"

            token = state.push("text", "", 0)
            token.content = state.helpers.normalizeLinkText(url)

            token = state.push("link_close", "a", -1)
            token.markup = "autolink"
            token.info = "auto"
        }

        state.pos += emailMatch[0].length
        return true
    }

    return false
}
