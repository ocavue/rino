import { clickSidebarNoteListItem, createNote, login } from "../actions"
import { pressKey, wait } from "../utils"

describe("Mode switch", function () {
    const expectWysiwygMode = async () => {
        await wait("wysiwyg-mode-textarea")
        await wait("source-code-mode-textarea", { hidden: true })
    }
    const expectSourceCodeMode = async () => {
        await wait("source-code-mode-textarea")
        await wait("wysiwyg-mode-textarea", { hidden: true })
    }
    const pressHotkey = async () => {
        await page.click(".ProseMirror")
        await pressKey("Meta", "Slash")
    }

    test("Parpare", async () => {
        await login()
        await createNote()
        await clickSidebarNoteListItem()
        await page.click(".ProseMirror")
    })
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
