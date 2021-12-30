import { getDocJson, pressKey, setupEmptyEditor, sleep, typeWysiwygEditor } from "./utils"

test("link", async () => {
    await setupEmptyEditor()
    await typeWysiwygEditor("hello [link](https://g.co)", false)
    await sleep(200)
    expect(await getDocJson()).toMatchObject({
        type: "doc",
        content: [
            {
                type: "paragraph",
                content: [
                    { type: "text", marks: [{ type: "mdText", attrs: { depth: 1, first: true, last: true } }], text: "hello " },
                    { type: "text", marks: [{ type: "mdMark", attrs: { depth: 1, first: true, last: false } }], text: "[" },
                    { type: "text", marks: [{ type: "mdLinkText", attrs: { depth: 2, href: "https://g.co" } }], text: "link" },
                    { type: "text", marks: [{ type: "mdMark", attrs: { depth: 1, first: false, last: false } }], text: "](" },
                    { type: "text", marks: [{ type: "mdLinkUri", attrs: { depth: 1 } }], text: "https://g.co" },
                    { type: "text", marks: [{ type: "mdMark", attrs: { depth: 1, first: false, last: true } }], text: ")" },
                ],
            },
        ],
    })

    await pressKey("ArrowLeft")
    await typeWysiwygEditor("9", false)
    await sleep(200)
    expect(await getDocJson()).toMatchObject({
        type: "doc",
        content: [
            {
                type: "paragraph",
                content: [
                    { type: "text", marks: [{ type: "mdText", attrs: { depth: 1, first: true, last: true } }], text: "hello " },
                    { type: "text", marks: [{ type: "mdMark", attrs: { depth: 1, first: true, last: false } }], text: "[" },
                    { type: "text", marks: [{ type: "mdLinkText", attrs: { depth: 2, href: "https://g.co" } }], text: "link" },
                    { type: "text", marks: [{ type: "mdMark", attrs: { depth: 1, first: false, last: false } }], text: "](" },
                    { type: "text", marks: [{ type: "mdLinkUri", attrs: { depth: 1 } }], text: "https://g.co9" },
                    { type: "text", marks: [{ type: "mdMark", attrs: { depth: 1, first: false, last: true } }], text: ")" },
                ],
            },
        ],
    })

    await pressKey(...Array(15).fill("ArrowLeft"))
    await typeWysiwygEditor("8", false)
    await sleep(200)
    expect(await getDocJson()).toMatchObject({
        type: "doc",
        content: [
            {
                type: "paragraph",
                content: [
                    { type: "text", marks: [{ type: "mdText", attrs: { depth: 1, first: true, last: true } }], text: "hello " },
                    { type: "text", marks: [{ type: "mdMark", attrs: { depth: 1, first: true, last: false } }], text: "[" },
                    { type: "text", marks: [{ type: "mdLinkText", attrs: { depth: 2, href: "https://g.co" } }], text: "link8" },
                    { type: "text", marks: [{ type: "mdMark", attrs: { depth: 1, first: false, last: false } }], text: "](" },
                    { type: "text", marks: [{ type: "mdLinkUri", attrs: { depth: 1 } }], text: "https://g.co9" },
                    { type: "text", marks: [{ type: "mdMark", attrs: { depth: 1, first: false, last: true } }], text: ")" },
                ],
            },
        ],
    })
})
