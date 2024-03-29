import type { RinoMarkAttrs, RinoMarkName } from "./inline-mark-extensions"

export enum InlineDecorateType {
    Ignore = "IGNORE",
}

export interface InlineToken {
    marks: RinoMarkName[]

    // Only for debugging
    text?: string

    // start position
    start: number
    // end position
    end: number

    attrs: RinoMarkAttrs
}
