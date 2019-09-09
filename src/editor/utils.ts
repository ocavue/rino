import { ResolvedPos } from "prosemirror-model"
import { Node } from "prosemirror-model"

export function findParentNode(
    $pos: ResolvedPos,
    predicate: (node: Node) => boolean,
): {
    pos: number
    node: Node
} | null {
    for (let i = $pos.depth; i > 0; i--) {
        const node = $pos.node(i)
        if (predicate(node)) {
            return {
                pos: i > 0 ? $pos.before(i) : 0,
                node,
            }
        }
    }
    return null
}

/**
 * Remove any common leading whitespace from every line in `text`.
 * Inspired by Python's `textwrap.dedent`.
 */
export function dedent(text: string) {
    let minWhitespace = -1
    let lines = text.split("\n")
    for (let line of lines) {
        if (line.length > 0) {
            let match = line.match(/^(\s*).*$/)
            if (match) {
                minWhitespace =
                    minWhitespace === -1
                        ? match[1].length
                        : Math.min(minWhitespace, match[1].length)
            } else {
                return text
            }
        }
    }
    return lines.map(line => (line.length > 0 ? line.slice(minWhitespace) : line)).join("\n")
}
