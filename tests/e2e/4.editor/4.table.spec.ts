import {
    click,
    focus,
    getSourceCodeModeText,
    goto,
    pressKey,
    sleep,
    type as typeByTestId,
    wait,
    wysiwygEditorSelector,
} from "../utils"
import { createNote } from "../actions"
import { dedent } from "src/utils"

async function prepare() {
    await goto("/")
    await createNote()
}

async function type(content: string) {
    await typeByTestId("wysiwyg-mode-textarea", content)
}

async function expectTableShape(tableNumber: number, trNumber: number, tdNumber: number) {
    await sleep(200)
    expect((await page.$$(`${wysiwygEditorSelector} > table`)).length).toBe(tableNumber)
    expect((await page.$$(`${wysiwygEditorSelector} > table > tr`)).length).toBe(trNumber)
    expect((await page.$$(`${wysiwygEditorSelector} > table > tr > td`)).length).toBe(tdNumber)
}

describe("Table", () => {
    async function clickCell() {
        await page.click(`${wysiwygEditorSelector} > table > tr > td`)
    }

    test("Prepare", prepare)

    test("Create table", async () => {
        await type("Table e2e tests")
        await type("| header | header | header |")
        await expectTableShape(1, 1, 3)
    })

    test("Show the table menu", async () => {
        await clickCell()
        for (const btn of [
            "add-column-before",
            "add-column-after",
            "add-row-before",
            "add-row-after",
            "delete-column",
            "delete-row",
        ]) {
            await wait(btn)
        }
    })

    test("Click 'add-column-before'", async () => {
        await clickCell()
        await click("add-column-before")
        await expectTableShape(1, 1, 4)
    })

    test("Click 'add-column-after'", async () => {
        await clickCell()
        await click("add-column-after")
        await expectTableShape(1, 1, 5)
    })

    test("Click 'add-row-before'", async () => {
        await clickCell()
        await click("add-row-before")
        await expectTableShape(1, 2, 10)
    })

    test("Click 'add-row-after'", async () => {
        await clickCell()
        await click("add-row-after")
        await expectTableShape(1, 3, 15)
    })
})

describe("Table with inline style", () => {
    test("Prepare", prepare)

    test("Create table", async () => {
        await type("Title")
        await type("| content | text **strong** text | `code` |")
        await expectTableShape(1, 1, 3)
    })

    test("Switch mode", async () => {
        await pressKey("Meta", "Slash")
        await sleep(1000)
        await getSourceCodeModeText()
    })

    test("Validate text", async () => {
        const text = await getSourceCodeModeText()
        expect(text.trim()).toEqual(
            dedent(`
                # Title



                | content | text **strong** text | \`code\` |
                | ------- | -------------------- | ------ |
                `).trim(),
        )
    })
})

describe("Table without other elements in WYSIWYG mode", () => {
    test("Prepare", prepare)

    test("Input", async () => {
        await focus("wysiwyg-mode-textarea")
        for (let i = 0; i < 5; i++) await pressKey("Backspace")
        await type("| aaaa | aaaa | aaaa |")
    })

    test("Check", async () => {
        await expectTableShape(1, 1, 3)
    })
})

describe("Table without other elements in Source Code mode", () => {
    test("Prepare", prepare)

    test("Input", async () => {
        await focus("wysiwyg-mode-textarea")
        await pressKey("Meta", "Slash")
        for (let i = 0; i < 9; i++) await pressKey("Backspace")
        await typeByTestId("source-code-mode-textarea", "| aaaa | aaaa | aaaa |")
        await typeByTestId("source-code-mode-textarea", "| :--- | :--- | :--- |")
        await typeByTestId("source-code-mode-textarea", "| bbbb | bbbb | bbbb |")
    })

    test("Switch to WYSIWYG mode", async () => {
        await pressKey("Meta", "Slash")
    })

    test("Check", async () => {
        await expectTableShape(1, 2, 6)
    })
})

// TODO: Add more tests
// - input text before/after cell
// - markdown style inside cell
