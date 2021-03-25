/* Copyright (c) 2020-present ocavue@gmail.com */

import { BlockquoteExtension } from "@remirror/extension-blockquote"

import { NodeSerializerOptions, ParserRuleType } from "../../transform"

export class RinoBlockquoteExtension extends BlockquoteExtension {
    public fromMarkdown() {
        return [
            {
                type: ParserRuleType.block,
                token: "blockquote",
                node: this.name,
                hasOpenClose: true,
            },
        ] as const
    }
    public toMarkdown({ state, node }: NodeSerializerOptions) {
        state.wrapBlock("> ", null, node, () => state.renderContent(node))
    }
}
