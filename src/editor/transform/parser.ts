import MarkdownIt from "markdown-it"
import Token from "markdown-it/lib/token"
import { Mark, Node, NodeType, Schema } from "prosemirror-model"

import markdownItListCheckbox from "src/editor/transform/markdown-it-list-checkbox"

import { BlockParserToken, ParserToken, ParserTokenType, TextParserToken } from "./parser-type"

interface StackItem {
    type: NodeType
    attrs?: Record<string, any>
    content: Node[]
}

type TokenHandler = (state: MarkdownParseState, tok: Token) => void
type TokenHandlers = Record<string, TokenHandler>

// Object used to track the context of a running parse.
class MarkdownParseState {
    private schema: Schema
    private marks: Mark[]
    private tokenHandlers: TokenHandlers
    public stack: StackItem[]

    public constructor(schema: Schema, tokenHandlers: TokenHandlers) {
        this.schema = schema
        this.stack = [{ type: schema.topNodeType, content: [] }]
        this.marks = Mark.none
        this.tokenHandlers = tokenHandlers
    }

    public top(): StackItem {
        return this.stack[this.stack.length - 1]
    }

    public push(node: Node): void {
        if (this.stack.length) this.top().content.push(node)
    }

    // Adds the given text to the current position in the document,
    // using the current marks as styling.
    public addText(text: string): void {
        if (!text) return

        const top = this.top()
        const nodes = top.content
        const last: Node | undefined = nodes[nodes.length - 1]
        const node = this.schema.text(text, this.marks)
        let merged: Node | undefined
        if (last && (merged = this.mergeTextNode(last, node))) nodes[nodes.length - 1] = merged
        else nodes.push(node)
    }

    private mergeTextNode(a: Node<Schema>, b: Node<Schema>): Node<Schema> | undefined {
        if (a.isText && b.isText && Mark.sameSet(a.marks, b.marks)) {
            const text: string = (a.text || "") + (b.text || "")
            return a.type.schema.text(text, a.marks)
        }
    }

    // Adds the given mark to the set of active marks.
    public openMark(mark: Mark): void {
        this.marks = mark.addToSet(this.marks)
    }

    // Removes the given mark from the set of active marks.
    public closeMark(mark: Mark): void {
        this.marks = mark.removeFromSet(this.marks)
    }

    public parseTokens(toks: Token[]): void {
        for (const tok of toks) {
            const handler = this.tokenHandlers[tok.type]
            if (!handler)
                throw new Error(
                    `MarkdownIt token type '${tok.type}' not supported by Rino Markdown parser`,
                )
            handler(this, tok)
        }
    }

    // Add a node at the current position.
    public addNode(type: NodeType, attrs?: Record<string, any>, content?: Node[]): Node | null {
        const node = type.createAndFill(attrs, content, this.marks)
        if (!node) return null
        this.push(node)
        return node
    }

    // Wrap subsequent content in a node of the given type.
    public openNode(type: NodeType, attrs?: Record<string, any>): void {
        this.stack.push({ type: type, attrs: attrs, content: [] })
    }

    // Close and return the node that is currently on top of the stack.
    public closeNode(): Node {
        if (this.marks.length) this.marks = Mark.none
        const info = this.stack.pop() as StackItem
        return this.addNode(info.type, info.attrs, info.content) as Node
    }
}

function withoutTrailingNewline(str: string): string {
    return str.endsWith("\n") ? str.slice(0, str.length - 1) : str
}

function buildBlockTokenHandler(
    parserToken: BlockParserToken,
    handlers: TokenHandlers,
    schema: Schema,
): void {
    const nodeType: NodeType = schema.nodes[parserToken.node]
    if (nodeType === undefined) {
        throw new RangeError(`Can't find block type '${parserToken.node}'`)
    }
    if (parserToken.hasOpenClose) {
        handlers[parserToken.token + "_open"] = (state: MarkdownParseState, tok: Token) => {
            const attrs = parserToken.getAttrs ? parserToken.getAttrs(tok) : undefined
            state.openNode(nodeType, attrs)
        }
        handlers[parserToken.token + "_close"] = (state: MarkdownParseState, tok: Token) => {
            state.closeNode()
        }
    } else {
        handlers[parserToken.token] = (state: MarkdownParseState, tok: Token) => {
            const attrs = parserToken.getAttrs ? parserToken.getAttrs(tok) : undefined
            state.openNode(nodeType, attrs)
            state.addText(withoutTrailingNewline(tok.content))
            state.closeNode()
        }
    }
}

function buildTextTokenHandler(parserToken: TextParserToken, handlers: TokenHandlers): void {
    handlers[parserToken.token] = (state: MarkdownParseState, tok: Token) => {
        state.addText(parserToken.getText(tok))
    }
}

function buildTokenHandlers(schema: Schema, parserTokens: ParserToken[]): TokenHandlers {
    const handlers: TokenHandlers = {}
    for (const parserToken of parserTokens) {
        switch (parserToken.type) {
            case ParserTokenType.text:
                buildTextTokenHandler(parserToken, handlers)
                break
            case ParserTokenType.block:
                buildBlockTokenHandler(parserToken, handlers, schema)
                break
            case ParserTokenType.ignore:
                handlers[parserToken.token] = () => {}
                break
        }
    }

    return handlers
}

export class MarkdownParser {
    private schema: Schema
    private tokenizer: MarkdownIt
    private tokenHandlers: TokenHandlers

    public constructor(schema: Schema, parserTokens: ParserToken[]) {
        this.schema = schema
        this.tokenizer = MarkdownIt("commonmark", { html: true })
            .disable(["emphasis", "autolink", "backticks", "entity"])
            .enable(["table"])
            .use(markdownItListCheckbox)
        this.tokenHandlers = buildTokenHandlers(schema, parserTokens)
    }

    public parse(text: string): Node {
        const state = new MarkdownParseState(this.schema, this.tokenHandlers)
        let doc: Node
        const mdTokens: Token[] = this.tokenizer.parse(text, {})

        state.parseTokens(mdTokens)
        do {
            doc = state.closeNode()
        } while (state.stack.length)
        return doc
    }
}
