import { MarkExtension, MarkExtensionSpec, NodeView, NodeViewMethod } from "@remirror/core"

const commonAttrs = {
    depth: { default: 0 },
}
const endpointAttrs = {
    depth: { default: 0 },
    start: { default: false },
    end: { default: false },
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
                "span",
                [
                    "a",
                    {
                        href: mark.attrs.href,
                        // This <a> element is `contenteditable`, so it's not clickable by default.
                        onClick: `window.open('${mark.attrs.href}')`,
                    },
                    0,
                ],
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
            img.setAttribute("src", mark.attrs.href)

            const outerContainer = document.createElement("span")
            outerContainer.appendChild(img)
            outerContainer.appendChild(innerContainer)
            outerContainer.setAttribute("class", "md-img-uri")

            return { dom: outerContainer, contentDOM: innerContainer }
        }
    }
}

const autoHideMarks: Record<string, true> = {
    mdMark: true,
    mdLinkUri: true,
    mdImgText: true,
    mdImgUri: true,
}
export function isAutoHideMark(name?: string): boolean {
    // This should be the fastest way based on my performance test.
    return autoHideMarks[name]
}

const rinoMarkExtensionClasses = [
    MetaKey,
    PlainText,
    Emphasis,
    Strong,
    CodeText,
    CodeSapce,
    Delete,
    LinkText,
    LinkUri,
    ImgText,
    ImgUri,
]
export const rinoMarkExtensions = rinoMarkExtensionClasses.map((Ext) => new Ext())
export type RinoMarkExtension = typeof rinoMarkExtensions[number]
export type RinoMarkName = RinoMarkExtension["name"]
