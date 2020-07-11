import { ReactComponentExtension } from "@remirror/extension-react-component"
import { CorePreset } from "@remirror/preset-core"

import {
    RinoBlockquoteExtension,
    RinoBulletListExtension,
    RinoCheckboxExtension,
    RinoCodeBlockExtension,
    RinoHardBreakExtension,
    RinoHeadingExtension,
    RinoHorizontalRuleExtension,
    RinoInlineDecorationExtension,
    RinoInlineMarkExtension,
    RinoListItemExtension,
    rinoMarkExtensions,
    RinoOrderedListExtension,
    RinoParagraphExtension,
    RinoTableCellExtension,
    RinoTableExtension,
    RinoTableHeaderExtension,
    RinoTableRowExtension,
    RinoTextExtension,
} from "src/editor/extensions"
import { MarkdownNodeExtension } from "src/editor/utils"

export class RinoCorePreset extends CorePreset {
    createExtensions() {
        const extensions = super.createExtensions()
        return extensions.map((e) => {
            if (e.name === "paragraph") return new RinoParagraphExtension()
            else if (e.name === "text") return new RinoTextExtension()
            else return e
        })
    }
}

export function createWysiwygCombined() {
    const rinoMarkdownNodeExtensions = [
        new RinoHardBreakExtension(),
        new RinoHorizontalRuleExtension(),
        new RinoCodeBlockExtension(),
        new RinoBlockquoteExtension(),
        new RinoHeadingExtension({}),
        new RinoCheckboxExtension(),
        new RinoListItemExtension(),
        new RinoBulletListExtension(),
        new RinoOrderedListExtension(),
        new RinoTableExtension(),
        new RinoTableRowExtension(),
        new RinoTableCellExtension(),
        new RinoTableHeaderExtension(),
    ]

    // By doing this, TypeScript can find extensions with wrong `MarkdownNodeExtension` implementation.
    // Notice that the variable `rinoMarkdownNodeExtensions` should NOT be type `MarkdownNodeExtension[]`
    // since we want TypeScript to know the actual shapes of `WysiwygExtensions`, `WysiwygSchema` and
    // `WysiwygManager`.
    //
    /* istanbul ignore if */
    if (process.env.NODE_ENV === "test") {
        const f = (x: MarkdownNodeExtension[]) => {}
        f(rinoMarkdownNodeExtensions)
    }

    return [
        new RinoCorePreset({}),
        ...rinoMarkExtensions,
        ...rinoMarkdownNodeExtensions,

        new ReactComponentExtension({}),
        new RinoInlineMarkExtension(),
        new RinoInlineDecorationExtension(),
    ]
}
