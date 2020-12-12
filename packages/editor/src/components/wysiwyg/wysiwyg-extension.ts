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
    RinoMarkExtension,
    rinoMarkExtensions,
    RinoOrderedListExtension,
    RinoParagraphExtension,
    RinoTableCellExtension,
    RinoTableExtension,
    RinoTableHeaderExtension,
    RinoTableRowExtension,
    RinoTextExtension,
} from "../../extensions"
import { MarkdownNodeExtension } from "../../utils"

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

function createRinoMarkdownNodeExtensions() {
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
    return rinoMarkdownNodeExtensions
}

type RinoMarkdownNodeExtension = ReturnType<typeof createRinoMarkdownNodeExtensions>[number]

export type WysiwygCombined =
    | RinoCorePreset
    | RinoMarkExtension
    | RinoMarkdownNodeExtension
    | ReactComponentExtension
    | RinoInlineMarkExtension
    | RinoInlineDecorationExtension

export function createWysiwygCombined(): Array<WysiwygCombined> {
    const rinoMarkdownNodeExtensions = createRinoMarkdownNodeExtensions()

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
