import { AnyExtension, FlexibleExtension, isExtension } from "@remirror/core"
import { MarkdownNodeExtension } from "src/editor/utils"
import { MarkdownParser } from "src/editor/transform/parser"
import { MarkdownSerializer } from "src/editor/transform/serializer-type"
import { ParserToken } from "src/editor/transform/parser-type"
import { WysiwygSchema, wysiwygExtensions } from "./wysiwyg-extension"

function isMarkdownNodeExtension(extension: FlexibleExtension): extension is MarkdownNodeExtension {
    return (
        isExtension(extension) && (extension as any).fromMarkdown
        // TODO: Add toMarkdown
        // isExtension(extension) && (extension as any).fromMarkdown && (extension as any).toMarkdown
    )
}

function convertToAnyExtension<T extends AnyExtension>(extension: FlexibleExtension<T>): T {
    return isExtension(extension) ? extension : extension.extension
}

const markdownNodeExtensions = (wysiwygExtensions as FlexibleExtension[])
    .map(convertToAnyExtension)
    .filter(isMarkdownNodeExtension)

export function buildMarkdownParser(schema: WysiwygSchema) {
    const parserTokens: ParserToken[] = []
    for (const extension of markdownNodeExtensions) {
        parserTokens.push(...extension.fromMarkdown())
    }

    return new MarkdownParser(schema, parserTokens)
}

enum TABLE_ALIGEN {
    DEFAULT = 1,
    CENTER = 2,
    RIGHT = 3,
    LEFT = 4,
}

export function buildMarkdownSerializer() {
    return new MarkdownSerializer({
        blockquote(state, node, parent, index) {
            state.wrapBlock("> ", null, node, () => state.renderContent(node))
        },
        codeBlock(state, node, parent, index) {
            state.write("```" + (node.attrs.userInputLanguage || "") + "\n")
            state.text(node.textContent, false)
            state.ensureNewLine()
            state.write("```")
            state.closeBlock(node)
        },
        heading(state, node, parent, index) {
            state.write(state.repeat("#", node.attrs.level) + " ")
            state.renderInline(node)
            state.closeBlock(node)
        },
        horizontalRule(state, node, parent, index) {
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
        hardBreak(state, node, parent, index) {
            for (let i = index + 1; i < parent.childCount; i++)
                if (parent.child(i).type != node.type) {
                    state.write("\\\n")
                    return
                }
        },
        text(state, node, parent, index) {
            state.text(node.text || "")
        },
        table(state, node, parent, index) {
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
}
