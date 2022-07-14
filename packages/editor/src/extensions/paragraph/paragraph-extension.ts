import { ApplySchemaAttributes, NodeExtensionSpec, NodeSpecOverride } from "@remirror/core"
import { ParagraphExtension } from "@remirror/extension-paragraph"

import { NodeSerializerOptions, ParserRuleType } from "../../transform"

export class RinoParagraphExtension extends ParagraphExtension {
    createNodeSpec(extra: ApplySchemaAttributes, override: NodeSpecOverride): NodeExtensionSpec {
        const spec = super.createNodeSpec(extra, override)
        // @ts-expect-error: remirror needs to be fixed for this to work
        return { ...spec, whitespace: "pre" }
    }

    fromMarkdown() {
        return [
            {
                type: ParserRuleType.block,
                token: "paragraph",
                node: this.name,
                hasOpenClose: true,
            },
        ] as const
    }

    toMarkdown({ state, node }: NodeSerializerOptions) {
        state.renderInline(node)
        state.closeBlock(node)
    }
}
