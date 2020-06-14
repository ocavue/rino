// Inline parser state

import MarkdownIt from "markdown-it"
import { isMdAsciiPunct, isPunctChar, isWhiteSpace } from "markdown-it/lib/common/utils"

import { ParserInline } from "./parser_inline"
import { Token } from "./token"

interface Delimiter {
    // Char code of the starting marker (number).
    //
    marker: number

    // Total length of these series of delimiters.
    //
    length: number

    // An amount of characters before this one that's equivalent to
    // current one. In plain English: if this delimiter does not open
    // an emphasis, neither do previous `jump` characters.
    //
    // Used to skip sequences like "*****" in one step, for 1st asterisk
    // value will be 0, for 2nd it's 1 and so on.
    //
    jump: number

    // A position of the token this delimiter corresponds to.
    //
    token: number

    // If this delimiter is matched as a valid opener, `end` will be
    // equal to its position, otherwise it's `-1`.
    //
    end: number

    // Boolean flags that determine if this delimiter could open
    // an emphasis.
    //
    open: boolean

    // Boolean flags that determine if this delimiter could close
    // an emphasis.
    //
    close: boolean
}

interface TokenMata {
    delimiters: Delimiter[]
}

class StateInlineHelpers {
    private md: MarkdownIt

    constructor(md: MarkdownIt) {
        this.md = md
    }

    parseLinkLabel(state: StateInline, start: number, disableNested?: boolean) {
        let labelEnd = -1,
            max = state.posMax,
            oldPos = state.pos

        state.pos = start + 1
        let level = 1
        let found = false

        while (state.pos < max) {
            let marker = state.src.charCodeAt(state.pos)
            if (marker === 0x5d /* ] */) {
                level--
                if (level === 0) {
                    found = true
                    break
                }
            }

            let prevPos = state.pos
            state.parser.skipToken(state) // removed this line
            if (marker === 0x5b /* [ */) {
                if (prevPos === state.pos - 1) {
                    // increase level if we find text `[`, which is not a part of any token
                    level++
                } else if (disableNested) {
                    state.pos = oldPos
                    return -1
                }
            }
        }

        if (found) {
            labelEnd = state.pos
        }

        // restore old state
        state.pos = oldPos

        return labelEnd
    }

    /**
     * Function used to decode link url to a human-readable format`
     */
    normalizeLinkText(url: string): string {
        return this.md.normalizeLinkText(url)
    }

    parseLinkDestination(
        str: string,
        pos: number,
        max: number,
    ): {
        ok: boolean
        pos: number
        lines: number
        str: string
    } {
        return this.md.helpers.parseLinkDestination(str, pos, max)
    }

    parseLinkTitle(
        str: string,
        pos: number,
        max: number,
    ): {
        ok: boolean
        pos: number
        lines: number
        str: string
    } {
        return this.md.helpers.parseLinkTitle(str, pos, max)
    }

    /**
     * Function used to encode link url to a machine-readable format,
     * which includes url-encoding, punycode, etc.
     */
    normalizeLink(url: string): string {
        return this.md.normalizeLink(url)
    }

    /**
     * Link validation function. CommonMark allows too much in links. By default
     * we disable `javascript:`, `vbscript:`, `file:` schemas, and almost all `data:...` schemas
     * except some embedded image types.
     *
     * You can change this behaviour:
     *
     * ```javascript
     * var md = require('markdown-it')();
     * // enable everything
     * md.validateLink = function () { return true; }
     * ```
     */
    validateLink(url: string): boolean {
        return this.md.validateLink(url)
    }
}

interface StateInlineOptions {
    maxNesting: number

    /**
     * Set `true` to enable HTML tags in source. Be careful!
     * That's not safe! You may need external sanitizer to protect output from XSS.
     * It's better to extend features via plugins, instead of enabling HTML.
     * @default false
     */
    html?: boolean
}

class StateInline {
    public src: string
    private md: MarkdownIt
    public parser: ParserInline
    public env: Record<string, any>
    public tokens: Token[]
    public tokens_meta: Array<TokenMata | null>
    public pos: number
    public posMax: number
    public level: number
    public pending: string
    public pendingLevel: number
    public cache: Record<number, number>
    public delimiters: Array<Delimiter>
    private _prev_delimiters: Array<Array<Delimiter>>
    public helpers: StateInlineHelpers
    public options: StateInlineOptions

    constructor(
        src: string,
        md: MarkdownIt,
        env: Record<string, any>,
        outTokens: Token[],
        parser: ParserInline,
        options?: StateInlineOptions,
    ) {
        this.src = src
        this.md = md
        this.parser = parser
        this.env = env
        this.tokens = outTokens

        this.tokens_meta = Array(outTokens.length)

        this.pos = 0
        this.posMax = this.src.length
        this.level = 0

        this.pending = ""
        this.pendingLevel = 0

        // Stores { start: end } pairs. Useful for backtrack
        // optimization of pairs parse (emphasis, strikes).
        this.cache = {}

        // List of emphasis-like delimiters for current tag
        this.delimiters = []

        // Stack of delimiter lists for upper level tags
        this._prev_delimiters = []

        this.helpers = new StateInlineHelpers(this.md)

        this.options = options || { maxNesting: 20 }
    }

    // Flush pending text
    //
    pushPending() {
        const token = new Token("text", "", 0)
        token.content = this.pending
        token.level = this.pendingLevel
        this.tokens.push(token)
        this.pending = ""
        return token
    }

    // Push new token to "stream".
    // If pending text exists - flush it as text token
    //
    push(type: string, tag: string, nesting: 1 | 0 | -1) {
        if (this.pending) {
            this.pushPending()
        }

        const token = new Token(type, tag, nesting)
        let token_meta = null

        if (nesting < 0) {
            // closing tag
            this.level--
            this.delimiters = this._prev_delimiters.pop() || []
        }

        token.level = this.level

        if (nesting > 0) {
            // opening tag
            this.level++
            this._prev_delimiters.push(this.delimiters)
            this.delimiters = []
            token_meta = { delimiters: this.delimiters }
        }

        this.pendingLevel = this.level
        this.tokens.push(token)
        this.tokens_meta.push(token_meta)
        return token
    }

    // Scan a sequence of emphasis-like markers, and determine whether
    // it can start an emphasis sequence or end an emphasis sequence.
    //
    //  - start - position to scan from (it should point at a valid marker);
    //  - canSplitWord - determine if these markers can be found inside a word
    //
    scanDelims(start: number, canSplitWord: boolean) {
        let pos = start,
            lastChar: number,
            nextChar: number,
            can_open: boolean,
            can_close: boolean,
            isLastWhiteSpace: boolean,
            isLastPunctChar: boolean,
            isNextWhiteSpace: boolean,
            isNextPunctChar: boolean,
            max = this.posMax,
            marker = this.src.charCodeAt(start)

        // treat beginning of the line as a whitespace
        lastChar = start > 0 ? this.src.charCodeAt(start - 1) : 0x20

        while (pos < max && this.src.charCodeAt(pos) === marker) {
            pos++
        }

        const length = pos - start

        // treat end of the line as a whitespace
        nextChar = pos < max ? this.src.charCodeAt(pos) : 0x20

        isLastPunctChar = isMdAsciiPunct(lastChar) || isPunctChar(String.fromCharCode(lastChar))
        isNextPunctChar = isMdAsciiPunct(nextChar) || isPunctChar(String.fromCharCode(nextChar))

        isLastWhiteSpace = isWhiteSpace(lastChar)
        isNextWhiteSpace = isWhiteSpace(nextChar)

        let left_flanking = true,
            right_flanking = true

        if (isNextWhiteSpace) {
            left_flanking = false
        } else if (isNextPunctChar) {
            if (!(isLastWhiteSpace || isLastPunctChar)) {
                left_flanking = false
            }
        }

        if (isLastWhiteSpace) {
            right_flanking = false
        } else if (isLastPunctChar) {
            if (!(isNextWhiteSpace || isNextPunctChar)) {
                right_flanking = false
            }
        }

        if (!canSplitWord) {
            can_open = left_flanking && (!right_flanking || isLastPunctChar)
            can_close = right_flanking && (!left_flanking || isNextPunctChar)
        } else {
            can_open = left_flanking
            can_close = right_flanking
        }

        return {
            can_open,
            can_close,
            length,
        }
    }

    // re-export Token class to use in block rules
    get Token() {
        return Token
    }

    // parse a sub-string
    parse(content: string) {
        let tokens: Token[] = []
        this.parser.parse(content, this.md, this.env, tokens)
        return tokens
    }
}

export { StateInline, Delimiter }
