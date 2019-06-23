// Defines a parser and serializer for [CommonMark](http://commonmark.org/) text.

export { schema } from "./src/schema"
export { InlineLexer }from './src/lexer'
export { defaultMarkdownParser, MarkdownParser } from "./src/markdown2prosemirror"
export { MarkdownSerializer, defaultMarkdownSerializer, MarkdownSerializerState } from "./src/prosemirror2markdown"

// https://github.com/parcel-bundler/parcel/issues/3153
import { Token } from './src/token'
export type Token = Token
