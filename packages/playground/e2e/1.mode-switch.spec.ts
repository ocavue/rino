import {
    expectSourceCodeMode,
    expectWysiwygMode,
    getSourceCodeModeText,
    pressKey,
    setupEmptyEditor,
    typeSourceCodeEditor,
    typeWysiwygEditor,
} from "./utils"

describe("Mode switch", function () {
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
        await typeWysiwygEditor("A", false)
    })
    test("Switch to source code mode", async () => {
        await pressHotkey()
        await expectSourceCodeMode()
        await typeSourceCodeEditor("B", false)
    })
    test("Switch back to WYSIWYG mode", async () => {
        await pressHotkey()
        await expectWysiwygMode()
        await typeWysiwygEditor("C", false)
    })
    test("Switch back to source code mode", async () => {
        await pressHotkey()
        await expectSourceCodeMode()
        await typeSourceCodeEditor("D", false)
        const text = await getSourceCodeModeText()
        expect(text.trim()).toEqual("ABCD")
    })
})
