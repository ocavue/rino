import { Mark, Node, NodeType, Schema } from "prosemirror-model"
import { defaultRinoCodeBlockExtensionOptions } from "../extensions"
import { getLanguage } from "@remirror/extension-code-block"
import MarkdownIt from "markdown-it"
import Token from "markdown-it/lib/token"
import markdownItListCheckbox from "src/editor/transform/markdown-it-list-checkbox"

interface StackItem {
    type: NodeType
    attrs?: Record<string, any>
    content: Node[]
}
// :: (Schema, MarkdownIt, Object)
// Create a parser with the given configuration. You can configure
// the markdown-it parser to parse the dialect you want, and provide
// a description of the ProseMirror entities those tokens map to in
// the `tokens` object, which maps token names to descriptions of
// what to do with them. Such a description is an object, and may
// have the following properties:
//
// **`node`**`: ?string`
//   :
//
// **`block`**`: ?string`

// **`attrs`**`: ?Object`

//

interface CommonTokenSpec {
    hasOpenClose: boolean
    /**
     * Attributes for the node or mark. When `getAttrs` is provided,
     * it takes precedence.
     */
    attrs?: Record<string, any>
    /**
     *A function used to compute the attributes for the node or mark
     *that takes a [markdown-it
     *token](https://markdown-it.github.io/markdown-it/#Token) and
     *returns an attribute object.
     */
    getAttrs?: (token: Token) => Record<string, any>
}
interface NodeTokenSpec extends CommonTokenSpec {
    /**
     * This token maps to a single node, whose type can be looked up
     * in the schema under the given name. Exactly one of `node`,
     * `block`, or `mark` must be set.
     */
    node: string
}
interface BlockTokenSpec extends CommonTokenSpec {
    /**
     * This token comes in `_open` and `_close` variants (which are
     * appended to the base token name provides a the object
     * property), and wraps a block of content. The block should be
     * wrapped in a node of the type named to by the property's
     * value.
     * block?: string
     */
    block: string
}
function isBlockTokenSpec(spec: TokenSpec): spec is BlockTokenSpec {
    return (spec as any).block !== undefined
}
type TokenSpec = NodeTokenSpec | BlockTokenSpec

interface TokenSpecs {
    [markdownItTokenName: string]: TokenSpec
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
            const text: string = a.text || "" + b.text || ""
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

function getAttrs(spec: TokenSpec, token: Token): Record<string, any> | undefined {
    if (spec.getAttrs) return spec.getAttrs(token)
    else return spec.attrs
}

function withoutTrailingNewline(str: string): string {
    return str.endsWith("\n") ? str.slice(0, str.length - 1) : str
}

function buildBlockTokenHandler(
    type: string,
    spec: BlockTokenSpec,
    handlers: TokenHandlers,
    schema: Schema,
): void {
    const nodeType: NodeType = schema.nodes[spec.block]
    if (nodeType === undefined) {
        throw new RangeError(`Can't find block type '${spec.block}'`)
    }
    if (spec.hasOpenClose) {
        handlers[type + "_open"] = (state: MarkdownParseState, tok: Token) => {
            state.openNode(nodeType, getAttrs(spec, tok))
        }
        handlers[type + "_close"] = (state: MarkdownParseState, tok: Token) => {
            state.closeNode()
        }
    } else {
        handlers[type] = (state: MarkdownParseState, tok: Token) => {
            state.openNode(nodeType, getAttrs(spec, tok))
            state.addText(withoutTrailingNewline(tok.content))
            state.closeNode()
        }
    }
}

function buildNodeTokenHandler(
    type: string,
    spec: NodeTokenSpec,
    handlers: TokenHandlers,
    schema: Schema,
): void {
    const nodeType: NodeType = schema.nodes[spec.node]
    if (nodeType === undefined) {
        throw new RangeError(`Can't find node type '${spec.node}'`)
    }
    handlers[type] = (state: MarkdownParseState, tok: Token) => {
        state.addNode(nodeType, getAttrs(spec, tok))
    }
}

function buildTokenHandlers(schema: Schema, tokens: TokenSpecs): TokenHandlers {
    const handlers: TokenHandlers = {
        text: (state, tok) => state.addText(tok.content),
        inline: (state, tok) => state.addText(tok.content), // decorationPlugin will handle the parsing of inline token
        softbreak: state => state.addText("\n"),
    }
    for (const [type, spec] of Object.entries(tokens)) {
        if (isBlockTokenSpec(spec)) {
            buildBlockTokenHandler(type, spec, handlers, schema)
        } else {
            buildNodeTokenHandler(type, spec, handlers, schema)
        }
    }
    return handlers
}

// ::- A configuration of a Markdown parser. Such a parser uses
// [markdown-it](https://github.com/markdown-it/markdown-it) to
// tokenize a file, and then runs the custom rules it is given over
// the tokens to create a ProseMirror document tree.
class MarkdownParser {
    private schema: Schema
    private tokenizer: MarkdownIt
    private tokenHandlers: TokenHandlers

    public constructor(schema: Schema, tokenizer: MarkdownIt, tokenSpecs: TokenSpecs) {
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
        const state = new MarkdownParseState(this.schema, this.tokenHandlers)
        let doc: Node
        let mdTokens: Token[] = this.tokenizer.parse(text, {})

        mdTokens = mdTokens.filter(
            token =>
                token.type !== "thead_open" &&
                token.type !== "thead_close" &&
                token.type !== "tbody_open" &&
                token.type !== "tbody_close",
        )

        state.parseTokens(mdTokens)
        do {
            doc = state.closeNode()
        } while (state.stack.length)
        return doc
    }
}

export class DefaultMarkdownParser extends MarkdownParser {
    public constructor(schema: Schema) {
        super(
            schema,
            MarkdownIt("commonmark", { html: true })
                .disable(["emphasis", "autolink", "backticks", "entity"])
                .enable(["table"])
                .use(markdownItListCheckbox),
            {
                blockquote: {
                    block: "blockquote",
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
                "list_checkbox": {
                    block: "rinoCheckbox",
                    hasOpenClose: false,
                    getAttrs: tok => ({ checked: tok.attrGet("checked") === "" }),
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
                    block: "heading",
                    hasOpenClose: true,
                    getAttrs: tok => ({ level: +tok.tag.slice(1) }),
                },
                // eslint-disable-next-line prettier/prettier
                // "code_block": {
                //     block: "rinoCodeBlock",
                //     hasOpenClose: false,
                // },
                fence: {
                    block: "codeBlock",
                    hasOpenClose: false,
                    getAttrs: tok => {
                        const userInputLanguage = tok.info
                        return {
                            language: getLanguage({
                                language: userInputLanguage,
                                fallback: defaultRinoCodeBlockExtensionOptions.defaultLanguage,
                                supportedLanguages:
                                    defaultRinoCodeBlockExtensionOptions.supportedLanguages,
                            }),
                            userInputLanguage,
                        }
                    },
                }, // TODO what does fence do?
                hr: {
                    node: "horizontalRule",
                    hasOpenClose: false,
                },
                // image: {
                //     block: "paragraph",
                //     hasOpenClose: false,
                // },
                // hardbreak: {
                //     node: "rinoHardBreak",
                //     hasOpenClose: false,
                // },
                table: {
                    block: "table",
                    hasOpenClose: true,
                },
                tr: {
                    block: "tableRow",
                    hasOpenClose: true,
                },
                th: {
                    block: "tableCell",
                    hasOpenClose: true,
                },
                td: {
                    block: "tableCell",
                    hasOpenClose: true,
                },
            },
        )
    }
}
