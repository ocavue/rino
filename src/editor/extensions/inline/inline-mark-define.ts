import { MarkExtension, MarkExtensionSpec, NodeView, NodeViewMethod } from "@remirror/core"

const commonAttrs = {
    depth: { default: 0 },
}
const endpointAttrs = {
    depth: { default: 0 },
    start: { default: false },
    end: { default: false },
}

const RinoMarkExtensionClasses = [
    class MetaKey extends MarkExtension {
        get name() {
            return "mdKey" as const
        }
        get schema(): MarkExtensionSpec {
            return {
                inclusive: false,
                attrs: endpointAttrs,
                toDOM: (mark, inline) => ["span", { class: "md-mark" }, 0],
            }
        }
    },

    class PlainText extends MarkExtension {
        get name() {
            return "mdText" as const
        }
        get schema(): MarkExtensionSpec {
            return {
                attrs: endpointAttrs,
                toDOM: (mark, inline) => ["span", 0],
            }
        }
    },

    class Emphasis extends MarkExtension {
        get name() {
            return "mdEm" as const
        }
        get schema(): MarkExtensionSpec {
            return {
                attrs: commonAttrs,
                toDOM: (mark, inline) => ["em", 0],
            }
        }
    },

    class Strong extends MarkExtension {
        get name() {
            return "mdStrong" as const
        }
        get schema(): MarkExtensionSpec {
            return {
                attrs: commonAttrs,
                toDOM: (mark, inline) => ["strong", 0],
            }
        }
    },

    class CodeText extends MarkExtension {
        get name() {
            return "mdCodeText" as const
        }
        get schema(): MarkExtensionSpec {
            return {
                attrs: commonAttrs,
                toDOM: (mark, inline) => ["code", 0],
            }
        }
    },

    class CodeSapce extends MarkExtension {
        get name() {
            return "mdCodeSpace" as const
        }
        get schema(): MarkExtensionSpec {
            return {
                attrs: commonAttrs,
                toDOM: (mark, inline) => ["span", 0],
            }
        }
    },

    class Delete extends MarkExtension {
        get name() {
            return "mdDel" as const
        }
        get schema(): MarkExtensionSpec {
            return {
                attrs: commonAttrs,
                toDOM: (mark, inline) => ["del", 0],
            }
        }
    },

    class LinkText extends MarkExtension {
        get name() {
            return "mdLinkText" as const
        }
        get schema(): MarkExtensionSpec {
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
    },

    class LinkUri extends MarkExtension {
        get name() {
            return "mdLinkUri" as const
        }
        get schema(): MarkExtensionSpec {
            return {
                spanning: false,
                attrs: commonAttrs,
                toDOM: (mark, inline) => ["a", { class: "md-link" }, 0],
            }
        }
    },

    class ImgText extends MarkExtension {
        get name() {
            return "mdImgText" as const
        }
        get schema(): MarkExtensionSpec {
            return {
                spanning: false,
                attrs: commonAttrs,
                toDOM: (mark, inline) => ["span", { class: "md-img-text" }, 0],
            }
        }
    },

    class ImgUri extends MarkExtension {
        get name() {
            return "mdImgUri" as const
        }
        get schema(): MarkExtensionSpec {
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
        public nodeView(): NodeViewMethod {
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
    },
]

export const rinoMarkExtensions = RinoMarkExtensionClasses.map((Ext) => new Ext())
export type RinoMarkExtension = typeof rinoMarkExtensions[number]
export type RinoMarkName = RinoMarkExtension["name"]

export function isAutoHideMark(name?: string) {
    return name === "mdKey" || name === "mdLinkUri" || name === "mdImgText" || name === "mdImgUri"
}
