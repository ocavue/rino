import "jest"

import { switchMode } from "./actions"
import { getSourceCodeModeText, setupEditor, type as typeByTestid } from "./utils"

beforeAll(async () => {
    await setupEditor()
})

async function type(text: string, pressEnter = true) {
    await typeByTestid("wysiwyg_mode_textarea", text, pressEnter)
}

describe("Source code text", () => {
    jest.setTimeout(180000)

    test("Create a note", async () => {
        await setupEditor("# ")
        await type("E2E test")
    })

    test("Inline text", async () => {
        await type("Text `Code` *Italic* **Strong** ***Italic+Strong***")
    })

    test("Headers", async () => {
        await type("# h1")
        await type("## h2")
        await type("### h3")
        await type("#### h4")
        await type("##### h5")
        await type("###### h6")
    })

    test("Ordered list", async () => {
        await type("1. First")
        await type("Second")
        await type("Third")
        await type("")
        await type("")
    })

    test("Quota", async () => {
        await type("Someone say:")
        await type("> Root 1")
        await type("Root 2")
        await type("> Sub 1")
        await type("Sub 2")
        await type("Sub 3")
        await type("")
        await type("Root 3")
        await type("Root 4")
        await type("")
        await type("And that's all")
    })

    test("Table", async () => {
        await type("| a | b | c |")
    })

    test("Check result", async () => {
        await switchMode() // Switch to the source code mode
        const received = await getSourceCodeModeText()
        expect(received.trim()).toMatchSnapshot()
        await switchMode() // Switch back to the WYSIWYG mode
    })
})
