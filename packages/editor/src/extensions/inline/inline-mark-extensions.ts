import { KeyBindings, MarkExtension, MarkExtensionSpec, NodeView, NodeViewMethod } from "@remirror/core"

import { formatHref } from "./format-href"
import { toggleInlineMark } from "./inline-mark-commands"

const commonAttrs = {
    depth: { default: 0 },
}
const endpointAttrs = {
    depth: { default: 0 },
    first: { default: false },
    last: { default: false },
}

class MetaKey extends MarkExtension {
    static disableExtraAttributes = true
    get name() {
        return "mdMark" as const
    }
    createMarkSpec(): MarkExtensionSpec {
        return {
            inclusive: false,
            attrs: endpointAttrs,
            toDOM: (mark, inline) => ["span", { class: "md-mark" }, 0],
        }
    }
    createCommands() {
        return {
            toggleInlineMark: toggleInlineMark,
        }
    }
}

class PlainText extends MarkExtension {
    static disableExtraAttributes = true
    get name() {
        return "mdText" as const
    }
    createMarkSpec(): MarkExtensionSpec {
        return {
            attrs: endpointAttrs,
            toDOM: (mark, inline) => ["span", 0],
        }
    }
}

class Emphasis extends MarkExtension {
    static disableExtraAttributes = true
    get name() {
        return "mdEm" as const
    }
    createMarkSpec(): MarkExtensionSpec {
        return {
            attrs: commonAttrs,
            toDOM: (mark, inline) => ["em", 0],
        }
    }
    createKeymap(): KeyBindings {
        return { "mod-i": toggleInlineMark(this.name) }
    }
}

class Strong extends MarkExtension {
    static disableExtraAttributes = true
    get name() {
        return "mdStrong" as const
    }
    createMarkSpec(): MarkExtensionSpec {
        return {
            attrs: commonAttrs,
            toDOM: (mark, inline) => ["strong", 0],
        }
    }
    createKeymap(): KeyBindings {
        return { "mod-b": toggleInlineMark(this.name) }
    }
}

class CodeText extends MarkExtension {
    static disableExtraAttributes = true
    get name() {
        return "mdCodeText" as const
    }
    createMarkSpec(): MarkExtensionSpec {
        return {
            attrs: commonAttrs,
            toDOM: (mark, inline) => ["code", 0],
        }
    }
    createKeymap(): KeyBindings {
        return { "mod-e": toggleInlineMark(this.name) }
    }
}

class CodeSapce extends MarkExtension {
    static disableExtraAttributes = true
    get name() {
        return "mdCodeSpace" as const
    }
    createMarkSpec(): MarkExtensionSpec {
        return {
            attrs: commonAttrs,
            toDOM: (mark, inline) => ["span", 0],
        }
    }
}

class Delete extends MarkExtension {
    static disableExtraAttributes = true
    get name() {
        return "mdDel" as const
    }
    createMarkSpec(): MarkExtensionSpec {
        return {
            attrs: commonAttrs,
            toDOM: (mark, inline) => ["del", 0],
        }
    }
    createKeymap(): KeyBindings {
        return { "mod-shift-s": toggleInlineMark(this.name) }
    }
}

class LinkText extends MarkExtension {
    static disableExtraAttributes = true
    get name() {
        return "mdLinkText" as const
    }
    createMarkSpec(): MarkExtensionSpec {
        return {
            attrs: {
                ...commonAttrs,
                href: {
                    default: "",
                },
            },
            toDOM: (mark) => [
                "a",
                {
                    href: mark.attrs.href,
                    // This <a> element is `contenteditable`, so it's not clickable by default.
                    onClick: `window.open('${mark.attrs.href}')`,
                },
                0,
            ],
        }
    }
}

class LinkUri extends MarkExtension {
    static disableExtraAttributes = true
    get name() {
        return "mdLinkUri" as const
    }
    createMarkSpec(): MarkExtensionSpec {
        return {
            spanning: false,
            attrs: commonAttrs,
            toDOM: (mark, inline) => ["a", { class: "md-link" }, 0],
        }
    }
}

class ImgText extends MarkExtension {
    static disableExtraAttributes = true
    get name() {
        return "mdImgText" as const
    }
    createMarkSpec(): MarkExtensionSpec {
        return {
            spanning: false,
            attrs: commonAttrs,
            toDOM: (mark, inline) => ["span", { class: "md-img-text" }, 0],
        }
    }
}

class ImgUri extends MarkExtension {
    static disableExtraAttributes = true
    get name() {
        return "mdImgUri" as const
    }
    createMarkSpec(): MarkExtensionSpec {
        return {
            spanning: false,
            attrs: {
                ...commonAttrs,
                href: {
                    default: "",
                },
            },
        }
    }
    createNodeViews = (): NodeViewMethod => {
        return (mark, view): NodeView => {
            const innerContainer = document.createElement("span")

            const img = document.createElement("img")
            img.setAttribute("src", formatHref(mark.attrs.href))

            const outerContainer = document.createElement("span")
            outerContainer.appendChild(img)
            outerContainer.appendChild(innerContainer)
            outerContainer.setAttribute("class", "md-img-uri")

            return { dom: outerContainer, contentDOM: innerContainer }
        }
    }
}

class Break extends MarkExtension {
    static disableExtraAttributes = true
    get name() {
        return "mdBreak" as const
    }
    createMarkSpec(): MarkExtensionSpec {
        return {
            attrs: commonAttrs,
            toDOM: (mark, inline) => ["span", { style: "border: 1px solid red; white-space: pre-wrap;" }, 0],
        }
    }
    // createNodeViews = (): NodeViewMethod => {
    //     return (mark, view): NodeView => {
    //         const wrapper = document.createElement("span")

    //         const outerContainer = document.createElement("br")
    //         outerContainer.appendChild(img)
    //         outerContainer.appendChild(innerContainer)
    //         outerContainer.setAttribute("class", "md-img-uri")

    //         return { dom: outerContainer, contentDOM: innerContainer }
    //     }
    // }
}

const autoHideMarks: Record<string, true> = {
    mdMark: true,
    mdLinkUri: true,
    mdImgText: true,
    mdImgUri: true,
}

export function isAutoHideMark(name: string): boolean {
    // This should be the fastest way based on my performance test.
    return autoHideMarks[name]
}

export const rinoMarkExtensions = [
    new MetaKey(),
    new PlainText(),
    new Emphasis(),
    new Strong(),
    new CodeText(),
    new CodeSapce(),
    new Delete(),
    new LinkText(),
    new LinkUri(),
    new ImgText(),
    new ImgUri(),
    new Break(),
]
export type RinoMarkExtension = typeof rinoMarkExtensions[number]
export type RinoMarkName = RinoMarkExtension["name"]
export type RinnMarkAttrs = {
    depth: number

    /**
     * At the current depth, if this token the first or last token of a serial of tokens.
     * example:
     *      input:
     *          Text**strong**[label](https://example.com)
     *      output:
     *          | token               | first | last |
     *          | ------------------- | ----- | ---- |
     *          | text                | true  | true |
     *          | **                  | true  |      |
     *          | strong              |       |      |
     *          | **                  |       | true |
     *          | [                   | true  |      |
     *          | label               |       |      |
     *          | ]                   |       |      |
     *          | (                   |       |      |
     *          | https://example.com |       |      |
     *          | )                   |       | true |
     */
    first?: boolean
    last?: boolean

    href?: string
}
