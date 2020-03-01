import { ExtensionManager, InferFlexibleExtensionList, SchemaFromExtensions } from "@remirror/core"
import {
    HardBreakExtension,
    HorizontalRuleExtension,
    baseExtensions,
} from "@remirror/core-extensions"
import {
    RinoBlockquoteExtension,
    RinoBulletListExtension,
    RinoCheckboxExtension,
    RinoCodeBlockExtension,
    RinoDecorationExtension,
    RinoHeadingExtension,
    RinoListItemExtension,
    RinoOrderedListExtension,
    RinoTableCellExtension,
    RinoTableExtension,
    RinoTableRowExtension,
} from "src/editor/extensions"
import { useMemo } from "react"

const wysiwygExtensions = [
    ...baseExtensions,
    new HorizontalRuleExtension(),
    new RinoCodeBlockExtension(),
    new RinoBlockquoteExtension(),
    new RinoDecorationExtension(),
    new RinoHeadingExtension(),
    new RinoCheckboxExtension(),
    new RinoListItemExtension(),
    new RinoBulletListExtension(),
    new RinoOrderedListExtension(),
    new HardBreakExtension(),
    new RinoTableExtension(),
    new RinoTableRowExtension(),
    new RinoTableCellExtension(),
]

export type WysiwygExtensions = InferFlexibleExtensionList<typeof wysiwygExtensions>
export type WysiwygManager = ExtensionManager<WysiwygExtensions>
export type WysiwygSchema = SchemaFromExtensions<WysiwygExtensions>

export function createWysiwygManager(): WysiwygManager {
    return ExtensionManager.create(wysiwygExtensions)
}
export function useWysiwygManager(): WysiwygManager {
    return useMemo(createWysiwygManager, [])
}
