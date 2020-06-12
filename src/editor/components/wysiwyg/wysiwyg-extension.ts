import { InferFlexibleExtensionList, SchemaFromExtensions } from "@remirror/core"
import { baseExtensions } from "@remirror/core-extensions"

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
    RinoTableRowExtension,
    RinoTextExtension,
} from "src/editor/extensions"
import { MarkdownNodeExtension } from "src/editor/utils"

/**
 * Replace ParagraphExtension as RinoParagraphExtension in baseExtensions.
 */
const rinoBaseExtensions = baseExtensions.map((e) => {
    if (e.extension.name === "paragraph")
        return {
            extension: new RinoParagraphExtension(),
            priority: e.priority,
        }
    else if (e.extension.name === "text")
        return {
            extension: new RinoTextExtension(),
            priority: e.priority,
        }
    else
        return {
            extension: e.extension,
            priority: e.priority,
        }
})

// By doing this, TypeScript can find extensions with wrong `MarkdownNodeExtension` implementation
const rinoMarkdownNodeExtensions: MarkdownNodeExtension[] = [
    new RinoHardBreakExtension(),
    new RinoHorizontalRuleExtension(),
    new RinoCodeBlockExtension(),
    new RinoBlockquoteExtension(),
    new RinoHeadingExtension(),
    new RinoCheckboxExtension(),
    new RinoListItemExtension(),
    new RinoBulletListExtension(),
    new RinoOrderedListExtension(),
    new RinoTableExtension(),
    new RinoTableRowExtension(),
    new RinoTableCellExtension(),
]

export const wysiwygExtensions = [
    ...rinoBaseExtensions,
    ...rinoMarkExtensions,
    ...rinoMarkdownNodeExtensions,

    new RinoInlineMarkExtension(),
    new RinoInlineDecorationExtension(),
]

export type WysiwygExtensions = InferFlexibleExtensionList<typeof wysiwygExtensions>
export type WysiwygSchema = SchemaFromExtensions<WysiwygExtensions>
