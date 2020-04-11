import * as _ from "lodash"
import { Mark, Node, Schema } from "prosemirror-model"

export type NodeSerializerOptions<S extends Schema = any> = {
    state: MarkdownSerializerState
    node: Node<S>
    parent: Node<S>
    index: number
}
export type NodeSerializerSpec = (options: NodeSerializerOptions) => void
export type NodeSerializerSpecs = Record<string, NodeSerializerSpec>

// ::- This is an object used to track state and expose
// methods related to markdown serialization. Instances are passed to
// node and mark serialization methods (see `toMarkdown`).
export class MarkdownSerializerState {
    private nodes: NodeSerializerSpecs
    private delimiter: string
    public out: string
    private closed: Node | null
    private marks: Record<string, any>

    public constructor(nodes: NodeSerializerSpecs, options?: Record<string, any>) {
        this.nodes = nodes
        this.marks = {}
        this.delimiter = ""
        this.out = ""
        this.closed = null
    }

    public flushClose(size?: number) {
        if (this.closed) {
            if (!this.atBlank()) this.out += "\n"
            if (size == null) size = 2
            if (size > 1) {
                const delimMin = _.trimEnd(this.delimiter)
                _.range(size).forEach(() => {
                    this.out += delimMin + "\n"
                })
            }
            this.closed = null
        }
    }

    // Render a block, prefixing each line with `delimiter`, and the first
    // line in `firstDelim`. `node` should be the node that is closed at
    // the end of the block, and `f` is a function that renders the
    // content of the block.
    public wrapBlock(newDelimiter: string, firstDelim: string | null, node: Node, f: () => void) {
        const oldDelimiter = this.delimiter
        this.write(firstDelim || newDelimiter)
        this.delimiter = this.delimiter + newDelimiter
        f()
        this.delimiter = oldDelimiter
        this.closeBlock(node)
    }

    public atBlank() {
        return /(^|\n)$/.test(this.out)
    }

    // :: ()
    // Ensure the current content ends with a newline.
    public ensureNewLine() {
        if (!this.atBlank()) this.out += "\n"
    }

    // Prepare the state for writing output (closing closed paragraphs,
    // adding delimiters, and so on), and then optionally add content
    // (unescaped) to the output.
    public write(content?: string) {
        this.flushClose()
        if (this.delimiter && this.atBlank()) this.out += this.delimiter
        if (content) this.out += content
    }

    // Close the block for the given node.
    public closeBlock(node: Node) {
        this.closed = node
    }

    // Add the given text to the document. When escape is true,
    // it will be escaped.
    public text(text: string, escape = true) {
        const lines = text.split("\n")
        for (let i = 0; i < lines.length; i++) {
            const startOfLine = this.atBlank() || this.closed
            this.write()
            this.out += escape ? this.esc(lines[i], Boolean(startOfLine)) : lines[i]
            if (i != lines.length - 1) this.out += "\n"
        }
    }

    // Render the given node as a block.
    public render(node: Node, parent: Node, index: number) {
        const spec = this.nodes[node.type.name]
        if (!spec) throw new Error(`Can't find node spec for type '${node.type.name}'`)
        spec({ state: this, node, parent, index })
    }

    // Render the contents of `parent` as block nodes.
    public renderContent(parent: Node) {
        parent.forEach((node, offset, index) => this.render(node, parent, index))
    }

    // Render the contents of `parent` as inline content.
    public renderInline(parent: Node) {
        parent.forEach((node, offset, index) => {
            if (node.isText) this.text(node.text || "", false)
            else this.render(node, parent, index)
        })
    }

    // Render a node's content as a list. `delim` should be the extra
    // indentation added to all lines except the first in an item,
    // `firstDelim` is a function going from an item index to a
    // delimiter for the first line of the item.
    public renderList(node: Node, delim: string, firstDelim: (n: number) => string): void {
        this.flushClose(1)
        node.forEach((child, _, i) => {
            if (i) this.flushClose(1)
            this.wrapBlock(delim, firstDelim(i), node, () => this.render(child, node, i))
        })
        this.ensureNewLine()
    }

    // Escape the given string so that it can safely appear in Markdown
    // content. If `startOfLine` is true, also escape characters that
    // has special meaning only at the start of the line.
    public esc(str: string, startOfLine?: boolean): string {
        str = str.replace(/[`*\\~\[\]]/g, "\\$&")
        if (startOfLine) str = str.replace(/^[:#\-*+]/, "\\$&").replace(/^(\d+)\./, "$1\\.")
        return str
    }

    public quote(str: string): string {
        const wrap = !str.includes(`"`) ? `""` : !str.includes(`'`) ? `''` : `()`
        return wrap[0] + str + wrap[1]
    }

    // Repeat the given string `n` times.
    public repeat(str: string, n: number): string {
        let out = ""
        for (let i = 0; i < n; i++) out += str
        return out
    }

    // Get the markdown string for a given opening or closing mark.
    public markString(mark: Mark, open: boolean, parent: Node, index: number): string {
        const info = this.marks[mark.type.name]
        const value = open ? info.open : info.close
        return typeof value == "string" ? value : value(this, mark, parent, index)
    }

    // :: (string) → { leading: ?string, trailing: ?string }
    // Get leading and trailing whitespace from a string. Values of
    // leading or trailing property of the return object will be undefined
    // if there is no match.
    public getEnclosingWhitespace(text: string) {
        return {
            leading: (/^(\s+)/.exec(text) || [])[0],
            trailing: (/(\s+)$/.exec(text) || [])[0],
        }
    }
}

export class MarkdownSerializer {
    private nodes: NodeSerializerSpecs

    public constructor(nodes: NodeSerializerSpecs) {
        this.nodes = nodes
    }

    // Serialize the content of the given node to
    // [CommonMark](http://commonmark.org/).
    public serialize(content: Node) {
        const state = new MarkdownSerializerState(this.nodes)
        state.renderContent(content)
        return state.out
    }
}
