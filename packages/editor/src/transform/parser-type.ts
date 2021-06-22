import Token from "markdown-it/lib/token"

import type { TokenHandler } from "./parser"

type MarkdownItToken = string

export enum ParserRuleType {
    text = 1,
    block,
    ignore,
    free,
}

export type TextParserRule = {
    type: ParserRuleType.text
    /** The name of the markdown-it token */
    token: MarkdownItToken
    getText: (token: Token) => string
}

export type BlockParserRule = {
    type: ParserRuleType.block
    /** The name of the prosemirror node type */
    node: string
    /** The name of the markdown-it token */
    token: MarkdownItToken
    /** Whether or not the markdown-it token has `_open` and `_close` suffix */
    hasOpenClose: boolean
    /** Get prosemirror node attributes from markdown-it token */
    getAttrs?: (token: Token) => Record<string, any>
}

export type IgnoreParserRule = {
    type: ParserRuleType.ignore
    /** The name of the markdown-it token */
    token: MarkdownItToken
}

export type FreeParserRule = {
    type: ParserRuleType.free
    /** The name of the markdown-it token */
    token: MarkdownItToken
    /** A function that can directly mutate the parser state */
    handler: TokenHandler
}

export type ParserRule = TextParserRule | BlockParserRule | IgnoreParserRule | FreeParserRule
