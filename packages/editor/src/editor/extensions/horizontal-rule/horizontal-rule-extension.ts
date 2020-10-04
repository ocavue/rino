import { HorizontalRuleExtension } from "@remirror/extension-horizontal-rule"

import { ParserRuleType } from "src/editor/transform/parser-type"
import { NodeSerializerOptions } from "src/editor/transform/serializer"

export class RinoHorizontalRuleExtension extends HorizontalRuleExtension {
    fromMarkdown() {
        return [
            {
                type: ParserRuleType.block,
                token: "hr",
                node: this.name,
                hasOpenClose: false,
            },
        ] as const
    }
    toMarkdown({ state, node }: NodeSerializerOptions) {
        state.write("---")
        state.closeBlock(node)
    }
}
