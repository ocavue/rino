import * as _ from "lodash"
import { Fragment, Mark, Node } from "prosemirror-model"

type NodeSpec = (state: MarkdownSerializerState, node: Node, parent: Node, index: number) => void
type NodeSpecs = Record<string, NodeSpec>

enum TABLE_ALIGEN {
    DEFAULT = 1,
    CENTER = 2,
    RIGHT = 3,
    LEFT = 4,
}

// ::- This is an object used to track state and expose
// methods related to markdown serialization. Instances are passed to
// node and mark serialization methods (see `toMarkdown`).
export class MarkdownSerializerState {
    private nodes: NodeSpecs
    private delimiter: string
    public out: string
    private closed: Node | null
    private inTightList: boolean
    private options: Record<string, any>
    private marks: Record<string, any>

    public constructor(nodes: NodeSpecs, options?: Record<string, any>) {
        this.nodes = nodes
        this.marks = {}
        this.delimiter = ""
        this.out = ""
        this.closed = null
        this.inTightList = false
        // :: Object
        // The options passed to the serializer.
        //   tightLists:: ?bool
        //   Whether to render lists in a tight style. This can be overridden
        //   on a node level by specifying a tight attribute on the node.
        //   Defaults to false.
        this.options = options || {}
        if (typeof this.options.tightLists == "undefined") this.options.tightLists = false
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
        this.nodes[node.type.name](this, node, parent, index)
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
        if (this.closed instanceof Node && this.closed.type == node.type) this.flushClose(3)
        else if (this.inTightList) this.flushClose(1)

        const isTight =
            typeof node.attrs.tight != "undefined" ? node.attrs.tight : this.options.tightLists
        const prevTight = this.inTightList
        this.inTightList = isTight
        node.forEach((child, _, i) => {
            if (i && isTight) this.flushClose(1)
            this.wrapBlock(delim, firstDelim(i), node, () => this.render(child, node, i))
        })
        this.inTightList = prevTight
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
    private nodes: NodeSpecs

    public constructor(nodes: NodeSpecs) {
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

export const defaultMarkdownSerializer = new MarkdownSerializer({
    rinoBlockquote(state, node, parent, index) {
        state.wrapBlock("> ", null, node, () => state.renderContent(node))
    },
    rinoCodeBlock(state, node, parent, index) {
        state.write("```" + (node.attrs.language || "") + "\n")
        state.text(node.textContent, false)
        state.ensureNewLine()
        state.write("```")
        state.closeBlock(node)
    },
    rinoHeading(state, node, parent, index) {
        state.write(state.repeat("#", node.attrs.level) + " ")
        state.renderInline(node)
        state.closeBlock(node)
    },
    rinoHorizontalRule(state, node, parent, index) {
        state.write(node.attrs.markup || "---")
        state.closeBlock(node)
    },
    rinoBulletList(state, node, parent, index) {
        state.renderList(node, "  ", () => (node.attrs.bullet || "*") + " ")
    },
    rinoOrderedList(state, node, parent, index) {
        const start = node.attrs.order || 1
        const maxW = String(start + node.childCount - 1).length
        const space = state.repeat(" ", maxW + 2)
        state.renderList(node, space, i => {
            const nStr = String(start + i)
            return state.repeat(" ", maxW - nStr.length) + nStr + ". "
        })
    },
    rinoListItem(state, node, parent, index) {
        state.renderContent(node)
    },
    rinoCheckbox(state, node, parent, index) {
        state.text(node.attrs.checked ? "[x] " : "[ ] ", false)
    },
    paragraph(state, node, parent, index) {
        state.renderInline(node)
        state.closeBlock(node)
    },
    /*
    image(state, node, parent, index) {
        state.write("![" + state.esc(node.attrs.alt || "") + "](" + state.esc(node.attrs.src) +
            (node.attrs.title ? " " + state.quote(node.attrs.title) : "") + ")")
    },
    */
    rinoHardBreak(state, node, parent, index) {
        for (let i = index + 1; i < parent.childCount; i++)
            if (parent.child(i).type != node.type) {
                state.write("\\\n")
                return
            }
    },
    text(state, node, parent, index) {
        state.text(node.text || "")
    },
    rinoTable(state, node, parent, index) {
        // TODO Use function `render` to handle each cell text.

        const table: string[][] = []
        const colAligns: TABLE_ALIGEN[] = []
        node.forEach((rowNode, _, rowIndex) => {
            const row: string[] = []
            rowNode.forEach((cellNode, _, colIndex) => {
                const fragment: Fragment = cellNode.content
                const textNode = fragment.firstChild
                const text = textNode ? (textNode.text || "").trim() : ""
                row.push(text)
                if (rowIndex === 0) {
                    colAligns[colIndex] = TABLE_ALIGEN.DEFAULT // TODO
                }
            })
            table.push(row)
        })

        const colWidths: number[] = new Array(colAligns.length)
        table.forEach((row, rowIndex) => {
            row.forEach((cell, colIndex) => {
                if (!colWidths[colIndex]) colWidths[colIndex] = 4
                colWidths[colIndex] = Math.max(cell.length, colWidths[colIndex])
            })
        })

        const spliter: string[] = new Array(colAligns.length)
        colWidths.forEach((width, colIndex) => {
            switch (colAligns[colIndex]) {
                case TABLE_ALIGEN.LEFT:
                    spliter[colIndex] = ":" + "-".repeat(width - 1)
                    break
                case TABLE_ALIGEN.RIGHT:
                    spliter[colIndex] = "-".repeat(width - 1) + ":"
                    break
                case TABLE_ALIGEN.CENTER:
                    spliter[colIndex] = ":" + "-".repeat(width - 2) + ":"
                    break
                default:
                    spliter[colIndex] = "-".repeat(width)
                    break
            }
        })
        table.splice(1, 0, spliter)

        let text = "\n"
        table.forEach(row => {
            row.forEach((cell, col) => {
                text += "| "
                const width = colWidths[col]
                if (colAligns[col] === TABLE_ALIGEN.CENTER) {
                    const pad = " ".repeat(Math.round((width - cell.length) / 2))
                    text += (pad + cell + pad).padEnd(width)
                } else if (colAligns[col] === TABLE_ALIGEN.RIGHT) {
                    text += cell.padStart(width)
                } else {
                    text += cell.padEnd(width)
                }
                text += " "
            })
            text += "|\n"
        })

        state.text(text, false)
    },
})
