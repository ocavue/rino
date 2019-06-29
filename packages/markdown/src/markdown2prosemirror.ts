import { schema } from "./schema"
import { Mark, Node, Schema, NodeType } from "prosemirror-model"
import Token from "markdown-it/lib/token"

// markdown-it doesn't support ES6 import. Ewwwwwww...
const MarkdownIt = require("markdown-it") // eslint-disable-line @typescript-eslint/no-var-requires

interface StackItem {
    type: NodeType
    attrs?: Record<string, any>
    content: Node[]
}
interface TokenSpec {
    hasOpenClose: boolean
    block?: string
    node?: string
    getAttrs?: (token: Token) => Record<string, any>
    attrs?: Record<string, any>
}
interface TokenSpecs {
    [markdownItTokenName: string]: TokenSpec
}
type TokenHandler = (state: MarkdownParseState, tok: any) => void
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
        let nodes = this.top().content
        let last = nodes[nodes.length - 1]
        let node = this.schema.text(text, this.marks)
        let merged: Node | undefined
        if (last && (merged = this.mergeTextNode(last, node))) nodes[nodes.length - 1] = merged
        else nodes.push(node)
    }

    private mergeTextNode(a: Node, b: Node): Node | undefined {
        if (a.isText && b.isText && Mark.sameSet(a.marks, b.marks)) {
            let text: string = a.text || "" + b.text || ""
            return (a.type.schema as Schema).text(text, a.marks)
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
        for (let tok of toks) {
            let handler = this.tokenHandlers[tok.type]
            if (!handler)
                throw new Error(
                    `MarkdownIt token type '${tok.type}' not supported by Rino Markdown parser`,
                )
            handler(this, tok)
        }
    }

    // Add a node at the current position.
    public addNode(type: NodeType, attrs?: Record<string, any>, content?: Node[]): Node | null {
        let node = type.createAndFill(attrs, content, this.marks)
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
        let info = this.stack.pop() as StackItem
        return this.addNode(info.type, info.attrs, info.content) as Node
    }
}

function getAttrs(spec: TokenSpec, token: Token) {
    if (spec.getAttrs) return spec.getAttrs(token)
    else return spec.attrs
}

function withoutTrailingNewline(str: string): string {
    return str[str.length - 1] == "\n" ? str.slice(0, str.length - 1) : str
}

function buildTokenHandlers(schema: Schema, tokens: TokenSpecs): TokenHandlers {
    let handlers: TokenHandlers = {
        text: (state, tok) => state.addText(tok.content),
        inline: (state, tok) => state.addText(tok.content), // decorationPlugin will handle the parsing of inline token
        softbreak: state => state.addText("\n"),
    }
    for (let [type, spec] of Object.entries(tokens)) {
        if (spec.block) {
            let nodeType: NodeType = schema.nodes[spec.block]
            if (nodeType === undefined) {
                throw new RangeError(`Can't find node type '${spec.node}'`)
            }
            if (spec.hasOpenClose) {
                handlers[type + "_open"] = (state: MarkdownParseState, tok: Token) =>
                    state.openNode(nodeType, getAttrs(spec, tok))
                handlers[type + "_close"] = (state: MarkdownParseState, tok: Token) =>
                    state.closeNode()
            } else {
                handlers[type] = (state: MarkdownParseState, tok: Token) => {
                    state.openNode(nodeType, getAttrs(spec, tok))
                    state.addText(withoutTrailingNewline(tok.content))
                    state.closeNode()
                }
            }
        } else if (spec.node) {
            let nodeType: NodeType = schema.nodes[spec.node]
            if (nodeType === undefined) {
                throw new RangeError(`Can't find node type '${spec.node}'`)
            }
            handlers[type] = (state: MarkdownParseState, tok: Token) =>
                state.addNode(nodeType, getAttrs(spec, tok))
        } else {
            throw new RangeError("Unrecognized parsing spec " + JSON.stringify(spec))
        }
    }

    return handlers
}

// ::- A configuration of a Markdown parser. Such a parser uses
// [markdown-it](https://github.com/markdown-it/markdown-it) to
// tokenize a file, and then runs the custom rules it is given over
// the tokens to create a ProseMirror document tree.
export class MarkdownParser {
    // :: (Schema, MarkdownIt, Object)
    // Create a parser with the given configuration. You can configure
    // the markdown-it parser to parse the dialect you want, and provide
    // a description of the ProseMirror entities those tokens map to in
    // the `tokens` object, which maps token names to descriptions of
    // what to do with them. Such a description is an object, and may
    // have the following properties:
    //
    // **`node`**`: ?string`
    //   : This token maps to a single node, whose type can be looked up
    //     in the schema under the given name. Exactly one of `node`,
    //     `block`, or `mark` must be set.
    //
    // **`block`**`: ?string`
    //   : This token comes in `_open` and `_close` variants (which are
    //     appended to the base token name provides a the object
    //     property), and wraps a block of content. The block should be
    //     wrapped in a node of the type named to by the property's
    //     value.
    //
    // **`mark`**`: ?string`
    //   : This token also comes in `_open` and `_close` variants, but
    //     should add a mark (named by the value) to its content, rather
    //     than wrapping it in a node.
    //
    // **`attrs`**`: ?Object`
    //   : Attributes for the node or mark. When `getAttrs` is provided,
    //     it takes precedence.
    //
    // **`getAttrs`**`: ?(MarkdownToken) → Object`
    //   : A function used to compute the attributes for the node or mark
    //     that takes a [markdown-it
    //     token](https://markdown-it.github.io/markdown-it/#Token) and
    //     returns an attribute object.
    private schema: Schema
    private tokenizer: any // tokenizer is a MarkdownIt object
    private tokenHandlers: TokenHandlers

    public constructor(schema: Schema, tokenizer: any, tokenSpecs: TokenSpecs) {
        // :: Object The value of the `tokens` object used to construct
        // this parser. Can be useful to copy and modify to base other
        // parsers on.
        this.schema = schema
        this.tokenizer = tokenizer
        this.tokenHandlers = buildTokenHandlers(schema, tokenSpecs)
    }

    // Parse a string as [CommonMark](http://commonmark.org/) markup,
    // and create a ProseMirror document as prescribed by this parser's
    // rules.
    public parse(text: string): Node {
        let state = new MarkdownParseState(this.schema, this.tokenHandlers),
            doc
        state.parseTokens(this.tokenizer.parse(text, {}))
        do {
            doc = state.closeNode()
        } while (state.stack.length)
        return doc
    }
}

// :: MarkdownParser
// A parser parsing unextended [CommonMark](http://commonmark.org/),
// without inline HTML, and producing a document in the basic schema.
export const defaultMarkdownParser = new MarkdownParser(
    schema,
    MarkdownIt("commonmark", { html: false }).disable([
        "emphasis",
        "autolink",
        "backticks",
        "entity",
    ]),
    {
        blockquote: {
            block: "rinoBlockquote",
            hasOpenClose: true,
        },
        paragraph: {
            block: "paragraph",
            hasOpenClose: true,
        },
        // eslint-disable-next-line prettier/prettier
        "list_item": {
            block: "rinoListItem",
            hasOpenClose: true,
        },
        // eslint-disable-next-line prettier/prettier
        "bullet_list": {
            block: "rinoBulletList",
            hasOpenClose: true,
        },
        // eslint-disable-next-line prettier/prettier
        "ordered_list": {
            block: "rinoOrderedList",
            hasOpenClose: true,
            getAttrs: tok => ({ order: +(tok.attrGet("order") || 1) }),
        },
        heading: {
            block: "rinoHeading",
            hasOpenClose: true,
            getAttrs: tok => ({ level: +tok.tag.slice(1) }),
        },
        // eslint-disable-next-line prettier/prettier
        "code_block": {
            block: "rinoCodeBlock",
            hasOpenClose: false,
        },
        fence: {
            block: "rinoCodeBlock",
            hasOpenClose: false,
            getAttrs: tok => ({ language: tok.info || "" }),
        }, // TODO what does fence do?
        hr: {
            node: "rinoHorizontalRule",
            hasOpenClose: false,
        },
        image: {
            block: "paragraph",
            hasOpenClose: false,
        },
        hardbreak: {
            node: "rinoHardBreak",
            hasOpenClose: false,
        },
    },
)
