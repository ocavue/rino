import Token from "markdown-it/lib/token"

type MarkdownItToken = string

export enum ParserTokenType {
    text = 1,
    block,
    ignore,
}

export type TextParserToken = {
    type: ParserTokenType.text
    /** The name of the markdown-it token */
    token: MarkdownItToken
    getText: (token: Token) => string
}

export type BlockParserToken = {
    type: ParserTokenType.block
    /** The name of the prosemirror node type */
    node: string
    /** The name of the markdown-it token */
    token: MarkdownItToken
    /** Whether or not the markdown-it token has `_open` and `_close` suffix */
    hasOpenClose: boolean
    /** Get prosemirror node attributes from markdown-it token */
    getAttrs?: (token: Token) => Record<string, any>
}

export type IgnoreParserToken = {
    type: ParserTokenType.ignore
    /** The name of the markdown-it token */
    token: MarkdownItToken
}

export type ParserToken = TextParserToken | BlockParserToken | IgnoreParserToken
