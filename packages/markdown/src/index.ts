import MarkdownIt from "markdown-it"
import MarkdownItParserInline from "markdown-it/lib/parser_inline"

import { ParserInline } from "./parser_inline"
import { Token } from "./token"

// TODO: remove this function
export function parseInline(str: string): Token[] {
    const parser = new ParserInline()

    type MutableMarkdownIt = {
        -readonly [K in keyof MarkdownIt]: MarkdownIt[K]
    }
    let md: MutableMarkdownIt = new MarkdownIt()
    md.inline = (null as unknown) as MarkdownItParserInline

    let tokens: Token[] = []
    parser.parse(str, md, {}, tokens)

    return tokens
}

export type { Token }
