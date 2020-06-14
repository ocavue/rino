/**
 * Create new token and fill passed properties.
 */
export class Token {
    constructor(type: string, tag: string, nesting: 1 | 0 | -1) {
        this.type = type
        this.tag = tag
        this.attrs = null
        this.map = null
        this.nesting = nesting
        this.level = 0
        this.children = null
        this.content = ""
        this.markup = ""
        this.info = ""
        this.meta = null
        this.block = false
        this.hidden = false
    }

    /**
     * Type of the token, e.g. "paragraph_open"
     */
    type: string

    /**
     * HTML tag name, e.g. "p"
     */
    tag: string

    /**
     * HTML attributes. Format: `[[name1, value1], [name2, value2]]`
     */
    attrs: [string, string][] | null

    /**
     * Source map info. Format: `[line_begin, line_end]`
     */
    map: [number, number] | null

    /**
     * Level change (number in {-1, 0, 1} set), where:
     *
     * - `1` means the tag is opening
     * - `0` means the tag is self-closing
     * - `-1` means the tag is closing
     */
    nesting: 1 | 0 | -1

    /**
     * nesting level, the same as `state.level`
     */
    level: number

    /**
     * An array of child nodes (inline and img tokens)
     */
    children: Token[] | null

    /**
     * In a case of self-closing tag (code, html, fence, etc.),
     * it has contents of this tag.
     */
    content: string

    /**
     * '*' or '_' for emphasis, fence string for fence, etc.
     */
    markup: string

    /**
     * Fence info string
     */
    info: string

    /**
     * A place for plugins to store an arbitrary data
     */
    meta: any

    /**
     * True for block-level tokens, false for inline tokens.
     * Used in renderer to calculate line breaks
     */
    block: boolean

    /**
     * If it's true, ignore this element when rendering. Used for tight lists
     * to hide paragraphs.
     */
    hidden: boolean

    /**
     * Search attribute index by name.
     */
    attrIndex(name: string): number {
        throw Error("NotImplementedError")
    }

    /**
     * Add `[name, value]` attribute to list. Init attrs if necessary
     */
    attrPush(attrData: [string, string]): void {
        throw Error("NotImplementedError")
    }

    /**
     * Set `name` attribute to `value`. Override old value if exists.
     */
    attrSet(name: string, value: string): void {
        throw Error("NotImplementedError")
    }

    /**
     * Get the value of attribute `name`, or null if it does not exist.
     */
    attrGet(name: string): string | null {
        throw Error("NotImplementedError")
    }

    /**
     *
     * Join value to existing attribute via space. Or create new attribute if not
     * exists. Useful to operate with token classes.
     */
    attrJoin(name: string, value: string): void {
        throw Error("NotImplementedError")
    }
}
