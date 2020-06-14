import { parseInline } from "../.."

test("simple strong", () => {
    let tokens = parseInline("**foo**")
    let expeced = [
        {
            type: "text",
            content: "",
            nesting: 0,
            level: 0,
        },
        {
            type: "strong_open",
            content: "**",
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
            type: "strong_close",
            content: "**",
            nesting: -1,
            level: 0,
        },
        {
            type: "text",
            content: "",
            nesting: 0,
            level: 0,
        },
    ]
    expect(tokens).toMatchObject(expeced)
})

test("simple em", () => {
    let tokens = parseInline("*foo*")
    let expeced = [
        {
            type: "em_open",
            content: "*",
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
            type: "em_close",
            content: "*",
            nesting: -1,
            level: 0,
        },
    ]
    expect(tokens).toMatchObject(expeced)
})

test("mixed em and strong", () => {
    let tokens = parseInline("*foo**bar***")
    let expeced = [
        {
            type: "em_open",
            content: "*",
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
            type: "strong_open",
            content: "**",
            nesting: 1,
            level: 1,
        },
        {
            type: "text",
            content: "bar",
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
        },
        {
            type: "em_close",
            content: "*",
            nesting: -1,
            level: 0,
        },
    ]
    expect(tokens).toMatchObject(expeced)
})
