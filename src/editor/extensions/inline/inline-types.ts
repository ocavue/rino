export enum InlineDecorateType {
    Ignore = "IGNORE",
}

import { RinoMarkName } from "./inline-mark-define"

/**
 * Token for inline content.
 *
 * The text in Prosemirror are "flat", but the text in markdown are in fact a tree.
 * So we add an attribute call `depth` to simulate the tree structure in Prosemirror.
 *
 * `depth` is larger or equal than 1 so we can simply use `if (mark.attrs?.depth)` to
 * check if this attribute exists.
 *
 * Markdown:    **strong*em`code`***
 * HTML:        <strong>strong<em>em<code>code</code></em></strong>
 * Prosemirror: [{ depth: 1, mark: "strong", content: "strong" },
 *               { depth: 2, mark: "em strong", content: "em"},
 *               { depth: 3, mark: "em strong code", content: "code"}]
 */
export interface InlineToken {
    marks: RinoMarkName[]
    text: string
    attrs: {
        depth: number
        href?: string
        start?: boolean // Is the first token of a serial of tokens
        end?: boolean // Is the last token of a serial of tokens
    }
}
