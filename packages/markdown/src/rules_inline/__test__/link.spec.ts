import { parseInline } from "../.."

test("simple link", () => {
    let tokens = parseInline("[foo](https://example.com/)")
    let expeced = [
        {
            type: "link_label_open",
            content: "[",
            nesting: 1,
            level: 0,
        },
        {
            type: "text",
            content: "foo",
            nesting: 0,
            level: 1,
        },
        {
            type: "link_label_close",
            content: "]",
            nesting: 0,
            level: 1,
        },
        {
            type: "link_parenthesis_open",
            content: "(",
            nesting: 0,
            level: 1,
        },
        {
            type: "link_space",
            content: "",
            nesting: 0,
            level: 1,
        },
        {
            type: "link_destination",
            content: "https://example.com/",
            nesting: 0,
            level: 1,
        },
        {
            type: "link_space",
            content: "",
            nesting: 0,
            level: 1,
        },
        {
            type: "link_title",
            content: "",
            nesting: 0,
            level: 1,
            attrs: [["title", ""]],
        },
        {
            type: "link_space",
            content: "",
            nesting: 0,
            level: 1,
        },
        {
            type: "link_parenthesis_close",
            content: ")",
            nesting: -1,
            level: 0,
        },
    ]
    expect(tokens).toMatchObject(expeced)
})

test("complex link", () => {
    let tokens = parseInline(String.raw`[ foo **strong**](  https://example.com/  "T\"t" )`)
    let expeced = [
        {
            type: "link_label_open",
            content: "[",
            nesting: 1,
            level: 0,
        },
        {
            type: "text",
            content: " foo ",
            nesting: 0,
            level: 1,
        },
        {
            type: "strong_open",
            content: "**",
            nesting: 1,
            level: 1,
        },
        {
            type: "text",
            content: "strong",
            nesting: 0,
            level: 2,
        },
        {
            type: "strong_close",
            content: "**",
            nesting: -1,
            level: 1,
        },
        {
            type: "text",
            content: "",
            nesting: 0,
            level: 1,
        },
        {
            type: "link_label_close",
            content: "]",
        },
        {
            type: "link_parenthesis_open",
            content: "(",
        },
        {
            type: "link_space",
            content: "  ",
        },
        {
            type: "link_destination",
            content: "https://example.com/",
            attrs: [["href", "https://example.com/"]],
        },
        {
            type: "link_space",
            content: "  ",
        },
        {
            type: "link_title",
            content: '"T' + String.fromCharCode(0x5c /* \ */) + '"t"',
            attrs: [["title", `T"t`]],
        },
        {
            type: "link_space",
            content: " ",
            nesting: 0,
            level: 1,
        },
        {
            type: "link_parenthesis_close",
            content: ")",
            nesting: -1,
            level: 0,
        },
    ]
    expect(tokens).toMatchObject(expeced)
})
