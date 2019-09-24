import { login, createNote, cleanNotes } from "./actions"
import { wait, click, pressKey } from "./utils"

describe("Mode switch", function() {
    beforeAll(async () => {
        await login()
        await createNote()
        await click("sidebar-list-item")
        await click("editor")
    })

    afterAll(async () => {
        await cleanNotes()
    })

    const expectWysiwygMode = async () => {
        await wait("wysiwyg-mode-textarea")
        await wait("source-code-mode-textarea", { hidden: true })
    }
    const expectSourceCodeMode = async () => {
        await wait("source-code-mode-textarea")
        await wait("wysiwyg-mode-textarea", { hidden: true })
    }
    const pressHotkey = async () => {
        await click("editor")
        await pressKey("Meta", "Slash")
    }

    test("Default mode", async () => {
        await expectWysiwygMode()
    })
    test("Switch to source code mode", async () => {
        await pressHotkey()
        await expectSourceCodeMode()
    })
    test("Switch back to WYSIWYG mode", async () => {
        await pressHotkey()
        await expectWysiwygMode()
    })
})
