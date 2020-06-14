import { parseInline } from "../.."

test("text", () => {
    let text = "Hello world"
    let tokens = parseInline(text)
    expect(tokens).toMatchObject([
        {
            type: "text",
            tag: "",
            attrs: null,
            map: null,
            nesting: 0,
            level: 0,
            children: null,
            content: text,
            markup: "",
            info: "",
            meta: null,
            block: false,
            hidden: false,
        },
    ])
})
