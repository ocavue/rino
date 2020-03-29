import { HardBreakExtension } from "@remirror/core-extensions"

import { NodeSerializerOptions } from "src/editor/transform/serializer"
import { MarkdownNodeExtension } from "src/editor/utils"

export class RinoHardBreakExtension extends HardBreakExtension implements MarkdownNodeExtension {
    fromMarkdown() {
        return []
    }
    toMarkdown({ state, node, parent, index }: NodeSerializerOptions) {
        for (let i = index + 1; i < parent.childCount; i++)
            if (parent.child(i).type != node.type) {
                state.write("\\\n")
                return
            }
    }
}
