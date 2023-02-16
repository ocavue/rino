import { DropCursorExtension } from "@remirror/extension-drop-cursor"
import { FindExtension } from "@remirror/extension-find"
import type { ParagraphExtension } from "@remirror/extension-paragraph"
import { ReactComponentExtension } from "@remirror/extension-react-component"
import type { TextExtension } from "@remirror/extension-text"
import { CorePreset, corePreset } from "@remirror/preset-core"

import {
    type MarkdownNodeExtension,
    buildCodeMirrorOptions,
    RinoBlockquoteExtension,
    RinoCodeMirrorExtension,
    RinoFileExtension,
    RinoHardBreakExtension,
    RinoHeadingExtension,
    RinoHorizontalRuleExtension,
    RinoInlineDecorationExtension,
    RinoInlineMarkExtension,
    RinoListExtension,
    RinoMarkExtension,
    rinoMarkExtensions,
    RinoParagraphExtension,
    RinoTableCellExtension,
    RinoTableExtension,
    RinoTableHeaderCellExtension,
    RinoTableRowExtension,
    RinoTextExtension,
} from "../../extensions"
import { WysiwygOptions } from "../types"

export type RinoCorePreset = Exclude<CorePreset, ParagraphExtension | TextExtension> | RinoParagraphExtension | RinoTextExtension

export function createRinoCorePreset(): RinoCorePreset[] {
    return [
        ...corePreset({ excludeExtensions: ["paragraph", "text"] }),
        new RinoParagraphExtension(),
        new RinoTextExtension(),
    ] as RinoCorePreset[]
}

function createRinoMarkdownNodeExtensions() {
    const rinoMarkdownNodeExtensions = [
        new RinoHardBreakExtension(),
        new RinoHorizontalRuleExtension(),
        new RinoCodeMirrorExtension(buildCodeMirrorOptions({ onlyMarkdown: false })),
        new RinoBlockquoteExtension(),
        new RinoHeadingExtension({}),

        // new RinoTaskListExtension(),
        // new RinoTaskListItemExtension(),
        // new RinoListItemExtension({}),
        // new RinoBulletListExtension({}),
        // new RinoOrderedListExtension(),

        new RinoListExtension(),

        new RinoTableExtension(),
        new RinoTableRowExtension(),
        new RinoTableCellExtension(),
        new RinoTableHeaderCellExtension(),
    ]
    return rinoMarkdownNodeExtensions
}

type RinoMarkdownNodeExtension = ReturnType<typeof createRinoMarkdownNodeExtensions>[number]

export type WysiwygExtension =
    | RinoCorePreset
    | RinoMarkExtension
    | RinoMarkdownNodeExtension
    | ReactComponentExtension
    | DropCursorExtension
    | FindExtension
    | RinoInlineMarkExtension
    | RinoInlineDecorationExtension
    | RinoFileExtension

export function createWysiwygExtension({ imageFileHandler }: WysiwygOptions): Array<WysiwygExtension> {
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
        ...createRinoCorePreset(),
        ...rinoMarkExtensions,
        ...rinoMarkdownNodeExtensions,

        new ReactComponentExtension({}),
        new DropCursorExtension(),
        new FindExtension(),
        new RinoInlineMarkExtension(),
        new RinoInlineDecorationExtension(),
        new RinoFileExtension({ imageFileHandler }),
    ]
}
