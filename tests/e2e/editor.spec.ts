import { login, cleanNotes, createNote } from "./actions"
import { sleep, pressKey, getSourceCodeModeText, type as typeByTestid } from "./utils"
import { readFileSync } from "fs"

function readText(filename: string) {
    return readFileSync(`${__dirname}/text/${filename}`, "utf-8")
}

describe("Write in WYSIWYG mode", () => {
    jest.setTimeout(180_000)

    async function type(text: string) {
        await typeByTestid("wysiwyg-mode-textarea", text)
    }

    async function switchMode() {
        await pressKey("Meta", "Slash")
        await sleep(500)
    }

    beforeAll(async () => {
        await login()
    })

    afterAll(async () => {
        await cleanNotes()
    })

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

    test("Code block with space", async () => {
        await type("```python")
        await type("for i in range(3000):")
        await type("    print(f'love u {i + 1} times')")
        await pressKey("Shift", "Enter")
        await type("")
    })

    test("Code block with tab", async () => {
        await type("```go")
        await type("for i := 0; i < 3000; i++ {")
        await type(`\tfmt.Printf("love u %d times\\n", i+1)`)
        await type("}")
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
        expect(await getSourceCodeModeText()).toBe(readText("0.txt"))
        await switchMode() // Switch back to the WYSIWYG mode
    })
})

describe("Firebase operation", () => {
    // App should not throw any error when doing firebase operation

    beforeAll(async () => {
        await login()
    })

    test("Create note", async () => {
        await createNote()
        await sleep(5000)
    })

    test("Editor note", async () => {
        await typeByTestid("wysiwyg-mode-textarea", "Something")
        await sleep(5000)
    })
})
