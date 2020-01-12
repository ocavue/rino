import { cleanNotes, createNote, login } from "../actions"
import {
    expectWysiwygHtml,
    pressKey,
    sleep,
    type as typeByTestid,
    wysiwygEditorSelector,
} from "../utils"

async function type(text: string, pressEnter = true) {
    await typeByTestid("wysiwyg-mode-textarea", text, pressEnter)
}

beforeAll(login)
afterAll(cleanNotes)

const checkedCheckboxSelector = `${wysiwygEditorSelector} input[type=checkbox][checked]`
const uncheckedCheckboxSelector = `${wysiwygEditorSelector} input[type=checkbox]:not([checked])`
const listItemSelector = `${wysiwygEditorSelector} li`
const orderlistSelector = `${wysiwygEditorSelector} ol`
const unorderlistSelector = `${wysiwygEditorSelector} ul`

async function expectElementsNumber(selector: string, number: number) {
    const selected = await page.$$(selector)
    expect(selected).toHaveLength(number)
}

async function expectListShape(options: {
    li?: number
    ol?: number
    ul?: number
    checked?: number
    unchecked?: number
}) {
    if (options.li !== undefined) {
        await expectElementsNumber(listItemSelector, options.li)
    }
    if (options.ol !== undefined) {
        await expectElementsNumber(orderlistSelector, options.ol)
    }
    if (options.ul !== undefined) {
        await expectElementsNumber(unorderlistSelector, options.ul)
    }
    if (options.checked !== undefined) {
        await expectElementsNumber(checkedCheckboxSelector, options.checked)
    }
    if (options.unchecked !== undefined) {
        await expectElementsNumber(uncheckedCheckboxSelector, options.unchecked)
    }
}

describe("Bullet list", () => {
    describe("Split list from middle", () => {
        beforeAll(createNote)

        test("Input", async () => {
            await type("h1")
            await type("- item 01")
            await type("item 02")
            await type("item 03")
            await expectListShape({ ul: 1, li: 4 })
        })

        test("Move the cursor", async () => {
            await pressKey("ArrowLeft")
            await pressKey("ArrowLeft")
            await pressKey("ArrowLeft")
            await expectListShape({ ul: 1, li: 4 })
        })

        test("Split list item", async () => {
            await pressKey("Enter")
            await expectListShape({ ul: 1, li: 5 })
        })
    })

    describe("Nested list", () => {
        beforeAll(createNote)

        test("Input 1, 2", async () => {
            await type("h1")
            await type("- item 1")
            await type("item 2")
            // await expectListShape({ ul: 1, li: 3 })
            await expectWysiwygHtml([
                "h1",
                {
                    ul: [{ li: ["p"] }, { li: ["p"] }, { li: ["p"] }],
                },
            ])
        })

        test("Shift right", async () => {
            await pressKey("Meta", "]")
            // await expectListShape({ ul: 2, li: 3 })
            await expectWysiwygHtml([
                "h1",
                {
                    ul: [
                        { li: ["p"] },
                        {
                            li: [
                                "p",
                                {
                                    ul: [{ li: ["p"] }],
                                },
                            ],
                        },
                    ],
                },
            ])
        })

        test("Input 2.1", async () => {
            await type("item 2.1")
            // await expectListShape({ ul: 2, li: 4 })
            await expectWysiwygHtml([
                "h1",
                {
                    ul: [
                        { li: ["p"] },
                        {
                            li: [
                                "p",
                                {
                                    ul: [{ li: ["p"] }, { li: ["p"] }],
                                },
                            ],
                        },
                    ],
                },
            ])
        })

        test("Input 2.2", async () => {
            await type("item 2.2", false)
            // await expectListShape({ ul: 2, li: 4 })
            await expectWysiwygHtml([
                "h1",
                {
                    ul: [
                        { li: ["p"] },
                        {
                            li: [
                                "p",
                                {
                                    ul: [{ li: ["p"] }, { li: ["p"] }],
                                },
                            ],
                        },
                    ],
                },
            ])
            await pressKey("Enter")
            await sleep(20 * 1000)

            // await expectListShape({ ul: 2, li: 5 })
            await expectWysiwygHtml([
                "h1",
                {
                    ul: [
                        { li: ["p"] },
                        {
                            li: [
                                "p",
                                {
                                    ul: [{ li: ["p"] }, { li: ["p"] }, { li: ["p"] }],
                                },
                            ],
                        },
                    ],
                },
            ])
        })

        test("Shift left", async () => {
            await pressKey("Meta", "[")
            await expectWysiwygHtml([
                "h1",
                {
                    ul: [
                        { li: ["p"] },
                        {
                            li: ["p", { ul: [{ li: ["p"] }, { li: ["p"] }] }],
                        },
                        { li: ["p"] },
                    ],
                },
            ])
        })

        test("Input 3", async () => {
            await type("item 3", false)
            await expectWysiwygHtml([
                "h1",
                {
                    ul: [
                        { li: ["p"] },
                        {
                            li: ["p", { ul: [{ li: ["p"] }, { li: ["p"] }] }],
                        },
                        { li: ["p"] },
                    ],
                },
            ])
            await pressKey("Enter")
            await expectWysiwygHtml([
                "h1",
                {
                    ul: [
                        { li: ["p"] },
                        {
                            li: ["p", { ul: [{ li: ["p"] }, { li: ["p"] }] }],
                        },
                        { li: ["p"] },
                        { li: ["p"] },
                    ],
                },
            ])
        })
    })
})

describe("List with checkbox", () => {
    const checkInput = "input[type=checkbox][checked]"
    const uncheckInput = "input[type=checkbox]:not([checked])"

    describe("Smoke testing", () => {
        beforeAll(createNote)

        test("Input", async () => {
            await type("h1")
            await type("- [ ] item 01")
            await type("item 02")
            await type("item 03")
            await expectListShape({ unchecked: 4, checked: 0 })

            await type("item 04", false)
            await expectListShape({ unchecked: 4, checked: 0 })

            await pressKey("Enter")
            await expectListShape({ unchecked: 5, checked: 0 })
            await expectWysiwygHtml([
                "h1",
                {
                    ul: [
                        { li: [uncheckInput, "p"] },
                        { li: [uncheckInput, "p"] },
                        { li: [uncheckInput, "p"] },
                        { li: [uncheckInput, "p"] },
                        { li: [uncheckInput, "p"] },
                    ],
                },
            ])

            await pressKey("Enter")
            await expectListShape({ unchecked: 4, checked: 0, li: 4 })
            await expectWysiwygHtml([
                "h1",
                {
                    ul: [
                        { li: [uncheckInput, "p"] },
                        { li: [uncheckInput, "p"] },
                        { li: [uncheckInput, "p"] },
                        { li: [uncheckInput, "p"] },
                    ],
                },
                "p",
            ])

            await type("end", false)
        })

        test("1st click", async () => {
            await page.click(uncheckedCheckboxSelector)
            await expectWysiwygHtml([
                "h1",
                {
                    ul: [
                        { li: [checkInput, "p"] },
                        { li: [uncheckInput, "p"] },
                        { li: [uncheckInput, "p"] },
                        { li: [uncheckInput, "p"] },
                    ],
                },
                "p",
            ])
        })

        test("2nd click", async () => {
            await page.click(uncheckedCheckboxSelector)
            await expectWysiwygHtml([
                "h1",
                {
                    ul: [
                        { li: [checkInput, "p"] },
                        { li: [checkInput, "p"] },
                        { li: [uncheckInput, "p"] },
                        { li: [uncheckInput, "p"] },
                    ],
                },
                "p",
            ])
        })

        test("3rd click", async () => {
            await page.click(checkedCheckboxSelector)
            await expectWysiwygHtml([
                "h1",
                {
                    ul: [
                        { li: [uncheckInput, "p"] },
                        { li: [checkInput, "p"] },
                        { li: [uncheckInput, "p"] },
                        { li: [uncheckInput, "p"] },
                    ],
                },
                "p",
            ])
        })

        test("Check source code mode", async () => {
            await pressKey("Meta", "Slash")
            await sleep(500)
            await pressKey("Meta", "Slash")
            await expectWysiwygHtml([
                "h1",
                {
                    ul: [
                        { li: [uncheckInput, "p"] },
                        { li: [checkInput, "p"] },
                        { li: [uncheckInput, "p"] },
                        { li: [uncheckInput, "p"] },
                    ],
                },
                "p",
            ])
        })
    })

    describe("Split list from middle", () => {
        beforeAll(createNote)

        test("Input", async () => {
            await type("h1")
            await type("- [ ] item 01")
            await type("item 02")
            await type("item 03")
            await expectListShape({ unchecked: 4, checked: 0 })
        })

        test("Move the cursor", async () => {
            await pressKey("ArrowLeft")
            await pressKey("ArrowLeft")
            await pressKey("ArrowLeft")
            await expectListShape({ unchecked: 4, checked: 0 })
        })

        test("Split list item", async () => {
            await pressKey("Enter")
            await expectListShape({ unchecked: 5, checked: 0 })
        })
    })

    describe("Delete checkbox", () => {
        beforeAll(createNote)

        test("Input", async () => {
            await type("h1")
            await type("- [ ] item 01")
            await type("item 02")
            await type("item 03")
            await expectListShape({ unchecked: 4, checked: 0, li: 4 })
        })

        test("Delete the last checkbox", async () => {
            await pressKey("Backspace")
            await expectListShape({ unchecked: 3, checked: 0, li: 4 })
        })

        test("Delete the last list item", async () => {
            await pressKey("Backspace")
            await expectListShape({ unchecked: 3, checked: 0, li: 3 })
        })

        test("Move the cursor", async () => {
            await pressKey("ArrowUp")
            await pressKey("ArrowUp")
            await expectListShape({ unchecked: 3, checked: 0, li: 3 })
        })

        test("Delete a checkbox from middle", async () => {
            await pressKey("Backspace")
            await expectListShape({ unchecked: 2, checked: 0, li: 3 })
        })

        test("Delete a list item from middle", async () => {
            await pressKey("Backspace")
            await expectListShape({ unchecked: 2, checked: 0, li: 2 })
        })
    })

    describe("Don't apply the checkbox input rule in a ordered list", () => {
        beforeAll(createNote)

        test("Input", async () => {
            await type("h1")
            await type("1. [x] item 01")
            await type("[ ] item 02")
            await type("")
        })

        test("Check", async () => {
            await expectListShape({ ol: 1, li: 2, ul: 0, checked: 0, unchecked: 0 })
        })
    })

    describe("Nested list", () => {
        beforeAll(createNote)

        test("Input 1, 2", async () => {
            await type("h1")
            await type("- [ ] item 1")
            await type("item 2")
            await expectListShape({ ul: 1, li: 3, unchecked: 3, checked: 0 })
            await expectWysiwygHtml([
                "h1",
                {
                    ul: [
                        { li: [uncheckInput, "p"] },
                        { li: [uncheckInput, "p"] },
                        { li: [uncheckInput, "p"] },
                    ],
                },
            ])
        })

        test("Shift right", async () => {
            await pressKey("Meta", "]")
            await expectListShape({ ul: 2, li: 3, unchecked: 3, checked: 0 })
            await expectWysiwygHtml([
                "h1",
                {
                    ul: [
                        { li: [uncheckInput, "p"] },
                        { li: [uncheckInput, "p", { ul: [{ li: [uncheckInput, "p"] }] }] },
                    ],
                },
            ])
        })

        test("Input 2.1", async () => {
            await type("item 2.1")
            await expectListShape({ ul: 2, li: 4, unchecked: 4, checked: 0 })
            await expectWysiwygHtml([
                "h1",
                {
                    ul: [
                        { li: [uncheckInput, "p"] },
                        {
                            li: [
                                uncheckInput,
                                "p",
                                {
                                    ul: [{ li: [uncheckInput, "p"] }, { li: [uncheckInput, "p"] }],
                                },
                            ],
                        },
                    ],
                },
            ])
        })

        test("Input 2.2", async () => {
            await type("item 2.2", false)
            await expectListShape({ ul: 2, li: 4, unchecked: 4, checked: 0 })
            await pressKey("Enter")
            await expectListShape({ ul: 2, li: 5, unchecked: 5, checked: 0 })
            await expectWysiwygHtml([
                "h1",
                {
                    ul: [
                        { li: [uncheckInput, "p"] },
                        {
                            li: [
                                uncheckInput,
                                "p",
                                {
                                    ul: [
                                        { li: [uncheckInput, "p"] },
                                        { li: [uncheckInput, "p"] },
                                        { li: [uncheckInput, "p"] },
                                    ],
                                },
                            ],
                        },
                    ],
                },
            ])
        })

        test("Shift left", async () => {
            await pressKey("Meta", "[")
            await expectWysiwygHtml([
                "h1",
                {
                    ul: [
                        { li: [uncheckInput, "p"] },
                        {
                            li: [
                                uncheckInput,
                                "p",
                                {
                                    ul: [{ li: [uncheckInput, "p"] }, { li: [uncheckInput, "p"] }],
                                },
                            ],
                        },
                        { li: [uncheckInput, "p"] },
                    ],
                },
            ])
        })

        test("Input 3", async () => {
            await type("item 3", false)
            await expectListShape({ ul: 2, li: 5, unchecked: 5, checked: 0 })
            await expectWysiwygHtml([
                "h1",
                {
                    ul: [
                        { li: [uncheckInput, "p"] },
                        {
                            li: [
                                uncheckInput,
                                "p",
                                {
                                    ul: [{ li: [uncheckInput, "p"] }, { li: [uncheckInput, "p"] }],
                                },
                            ],
                        },
                        { li: [uncheckInput, "p"] },
                    ],
                },
            ])
            await pressKey("Enter")
            await expectWysiwygHtml([
                "h1",
                {
                    ul: [
                        { li: [uncheckInput, "p"] },
                        {
                            li: [
                                uncheckInput,
                                "p",
                                {
                                    ul: [{ li: [uncheckInput, "p"] }, { li: [uncheckInput, "p"] }],
                                },
                            ],
                        },
                        { li: [uncheckInput, "p"] },
                        { li: [uncheckInput, "p"] },
                    ],
                },
            ])
        })
    })
})
