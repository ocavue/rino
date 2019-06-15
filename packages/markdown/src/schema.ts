import { Schema, NodeSpec, MarkSpec } from "prosemirror-model"


const nodes: { [name: string]: NodeSpec } = {
    /*
    Every schema must at least define a top-level node type (which defaults to the name "doc", but
    you can configure that), and a "text" type for text content.
    */

    doc: {
        content: "block+"
    },

    text: {
        inline: true, // text is inline by default
        group: "inline",
        toDOM(node) { return node.text || '' }
    },

    paragraph: {
        content: "inline*",
        group: "block",
        parseDOM: [{ tag: "p" }],
        toDOM() { return ["p", 0] }
    },

    rinoBlockquote: {
        content: "block+",
        group: "block",
        parseDOM: [{ tag: "blockquote" }],
        toDOM() { return ["blockquote", 0] }
    },

    rinoHorizontalRule: {
        group: "block",
        parseDOM: [{ tag: "hr" }],
        toDOM() { return ["div", ["hr"]] }
    },

    heading: {
        attrs: { level: { default: 1 } },
        content: "inline*",
        group: "block",
        defining: true,
        parseDOM: [
            { tag: "h1", attrs: { level: 1 } },
            { tag: "h2", attrs: { level: 2 } },
            { tag: "h3", attrs: { level: 3 } },
            { tag: "h4", attrs: { level: 4 } },
            { tag: "h5", attrs: { level: 5 } },
            { tag: "h6", attrs: { level: 6 } }
        ],
        toDOM(node) { return ["h" + node.attrs.level, 0] }
    },

    rinoCodeBlock: {
        content: "text*",
        group: "block",
        code: true,
        defining: true,
        attrs: { language: { default: "" } },
        parseDOM: [{
            tag: "pre",
            preserveWhitespace: true,
            getAttrs: (dom: HTMLElement) => (
                { language: dom.getAttribute("data-language") || "" }
            )
        }],
        toDOM(node) {
            let empty: { [attr: string]: string } = {}
            return [
                "pre",
                node.attrs.language ? { "data-language": node.attrs.language } : empty,
                ["code", 0],
            ]
        }
    },

    rinoOrderedList: {
        content: "rinoListItem+",
        group: "block",
        attrs: {
            order: { default: 1 },
            tight: { default: false }
        },
        parseDOM: [{
            tag: "ol", getAttrs(dom: HTMLElement) {
                return {
                    order: dom.hasAttribute("start") ? +dom.getAttribute("start") : 1,
                    tight: dom.hasAttribute("data-tight")
                }
            }
        }],
        toDOM(node) {
            return [
                "ol",
                {
                    "start": node.attrs.order == 1 ? "" : node.attrs.order,
                    "data-tight": node.attrs.tight ? "true" : ""
                },
                0,
            ]
        }
    },

    rinoBulletList: {
        content: "rinoListItem+",
        group: "block",
        attrs: { tight: { default: false } },
        parseDOM: [{
            tag: "ul",
            getAttrs: (dom: HTMLElement) => ({ tight: dom.hasAttribute("data-tight") })
        }
        ],
        toDOM(node) {
            return [
                "ul",
                { "data-tight": node.attrs.tight ? "true" : "" },
                0,
            ]
        }
    },

    rinoListItem: {
        content: "paragraph block*", // Means 'first a paragraph, then one or more blocks'.
        defining: true,
        parseDOM: [{ tag: "li" }],
        toDOM() { return ["li", 0] }
    },

    image: {
        inline: true,
        attrs: {
            src: {},
            alt: { default: null },
            title: { default: null }
        },
        group: "inline",
        draggable: true,
        parseDOM: [{
            tag: "img[src]", getAttrs(dom: HTMLElement) {
                return {
                    src: dom.getAttribute("src"),
                    title: dom.getAttribute("title"),
                    alt: dom.getAttribute("alt")
                }
            }
        }],
        toDOM(node) { return ["img", node.attrs] }
    },

    rinoHardBreak: {
        inline: true,
        group: "inline",
        selectable: false,
        parseDOM: [{ tag: "br" }],
        toDOM() { return ["br"] }
    }

}

const marks: { [name: string]: MarkSpec } = {
    em: {
        parseDOM: [
            { tag: "i" },
            { tag: "em" },
            { style: "font-style", getAttrs: value => value == "italic" && null },
        ],
        toDOM() { return ["em"] }
    },

    strong: {
        parseDOM: [
            { tag: "b" },
            { tag: "strong" },
            { style: "font-weight", getAttrs: (value: string) => /^(bold(er)?|[5-9]\d{2,})$/.test(value) && null },
        ],
        toDOM() { return ["strong"] }
    },

    link: {
        attrs: {
            href: {},
            title: { default: null }
        },
        inclusive: false,
        parseDOM: [
            {
                tag: "a[href]", getAttrs(dom: HTMLElement) {
                    return { href: dom.getAttribute("href"), title: dom.getAttribute("title") }
                }
            },
        ],
        toDOM(node) { return ["a", node.attrs] }
    },

    code: {
        parseDOM: [
            { tag: "code" },
        ],
        toDOM() { return ["code"] }
    }
}

// ::Schema Document schema for the data model used by CommonMark.
export const schema = new Schema({ nodes: nodes, marks: marks })
