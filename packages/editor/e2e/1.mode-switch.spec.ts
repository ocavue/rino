import { getSourceCodeModeText, pressKey, setupEmptyEditor, typeSourceCodeEditor, typeWysiwygEditor, wait } from "./utils"

describe("Mode switch", function () {
    const expectWysiwygMode = async () => {
        await wait("wysiwyg_mode_textarea")
        await wait("source_code_mode_textarea", { state: "hidden" })
    }
    const expectSourceCodeMode = async () => {
        await wait("source_code_mode_textarea")
        await wait("wysiwyg_mode_textarea", { state: "hidden" })
    }
    const pressHotkey = async () => {
        await page.click(".ProseMirror")
        await pressKey("Meta", "Slash")
    }

    beforeAll(async () => {
        await setupEmptyEditor()
    })
    test("Parpare", async () => {
        await page.click(".ProseMirror")
    })
    test("Default mode", async () => {
        await expectWysiwygMode()
        await typeWysiwygEditor("1", false)
    })
    test("Switch to source code mode", async () => {
        await pressHotkey()
        await expectSourceCodeMode()
        await typeSourceCodeEditor("2", false)
    })
    test("Switch back to WYSIWYG mode", async () => {
        await pressHotkey()
        await expectWysiwygMode()
        await typeWysiwygEditor("3", false)
    })
    test("Switch back to source code mode", async () => {
        await pressHotkey()
        await expectSourceCodeMode()
        await typeSourceCodeEditor("4", false)
        const text = await getSourceCodeModeText()
        expect(text.trim()).toEqual("1234")
    })
})
