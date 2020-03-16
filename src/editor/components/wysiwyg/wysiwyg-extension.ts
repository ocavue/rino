import { HardBreakExtension, baseExtensions } from "@remirror/core-extensions"
import { InferFlexibleExtensionList, SchemaFromExtensions } from "@remirror/core"
import {
    RinoBlockquoteExtension,
    RinoBulletListExtension,
    RinoCheckboxExtension,
    RinoCodeBlockExtension,
    RinoDecorationExtension,
    RinoHeadingExtension,
    RinoHorizontalRuleExtension,
    RinoListItemExtension,
    RinoOrderedListExtension,
    RinoParagraphExtension,
    RinoTableCellExtension,
    RinoTableExtension,
    RinoTableRowExtension,
} from "src/editor/extensions"

/**
 * Replace ParagraphExtension as RinoParagraphExtension in baseExtensions.
 */
const baseExtensionsWithRinoParagraph = baseExtensions.map(e => {
    return e.extension.name === "paragraph"
        ? {
              extension: new RinoParagraphExtension(),
              priority: e.priority,
          }
        : {
              extension: e.extension,
              priority: e.priority,
          }
})

export const wysiwygExtensions = [
    ...baseExtensionsWithRinoParagraph,
    new HardBreakExtension(),
    new RinoHorizontalRuleExtension(),
    new RinoCodeBlockExtension(),
    new RinoBlockquoteExtension(),
    new RinoDecorationExtension(),
    new RinoHeadingExtension(),
    new RinoCheckboxExtension(),
    new RinoListItemExtension(),
    new RinoBulletListExtension(),
    new RinoOrderedListExtension(),
    new RinoTableExtension(),
    new RinoTableRowExtension(),
    new RinoTableCellExtension(),
]

export type WysiwygExtensions = InferFlexibleExtensionList<typeof wysiwygExtensions>
export type WysiwygSchema = SchemaFromExtensions<WysiwygExtensions>
