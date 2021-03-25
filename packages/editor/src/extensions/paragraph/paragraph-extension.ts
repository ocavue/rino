/* Copyright (c) 2020-present ocavue@gmail.com */

import { ParagraphExtension } from "@remirror/extension-paragraph"

import { NodeSerializerOptions, ParserRuleType } from "../../transform"

export class RinoParagraphExtension extends ParagraphExtension {
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
