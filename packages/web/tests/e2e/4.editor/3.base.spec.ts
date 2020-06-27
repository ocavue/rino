import { readFileSync } from "fs"

import { cleanNotes, createNote, login, switchMode } from "../actions"
import { getSourceCodeModeText, pressKey, type as typeByTestid } from "../utils"

function readText(filename: string) {
    return readFileSync(`${__dirname}/${filename}`, "utf-8")
}

beforeAll(async () => {
    await jestPuppeteer.resetBrowser()
    await login()
})

afterAll(async () => {
    await cleanNotes()
})

async function type(text: string, pressEnter = true) {
    await typeByTestid("wysiwyg-mode-textarea", text, pressEnter)
}

describe("Source code text", () => {
    jest.setTimeout(180000)

    test("Create a note", async () => {
        await createNote()
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

    test("Code block", async () => {
        await type("```")
        await type("code")
        await type("code", false)
        await pressKey("Shift", "Enter")
        await type("")
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
        expect(received).toBe(readText("0.txt"))
        await switchMode() // Switch back to the WYSIWYG mode
    })
})
