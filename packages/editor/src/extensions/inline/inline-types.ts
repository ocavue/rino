import type { RinnMarkAttrs, RinoMarkName } from "./inline-mark-extensions"

export enum InlineDecorateType {
    Ignore = "IGNORE",
}

export interface InlineToken {
    marks: RinoMarkName[]

    text: string

    // start position
    start: number
    // end position
    end: number

    attrs: RinnMarkAttrs
}
