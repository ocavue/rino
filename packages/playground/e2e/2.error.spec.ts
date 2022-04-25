import { switchMode, switchToSourceCodeMode, switchToWysiwygMode } from "./actions"
import { expectWysiwygMode, getInnerText, getSourceCodeModeText, setupEmptyEditor, typeSourceCodeEditor, wait } from "./utils"

describe("ProsemirrorView constructor error", () => {
    test("Prepare", async () => {
        await setupEmptyEditor()
        await expectWysiwygMode()
    })

    test("Make the alert message", async () => {
        // Switch to source code mode
        await switchToSourceCodeMode()

        await typeSourceCodeEditor("HOOK:FAILED_TO_INIT_PROSEMIRROR_VIEW")

        // Switch back to wysiwyg code mode. This should show the alert message.
        await switchMode()
        const error = await getInnerText("wysiwyg_mode_error")
        expect(error).toContain("Something went wrong.\n\nError: Found error hook for testing")
    })

    test("Compare the text in source code mode", async () => {
        // Switch to source code mode. This should work.
        await switchToSourceCodeMode()

        const text = await getSourceCodeModeText()
        expect(text.trim()).toEqual("HOOK:FAILED_TO_INIT_PROSEMIRROR_VIEW")
    })

    test("Fix text in source code mode", async () => {
        await typeSourceCodeEditor("something")
    })

    test("Switch back to wysiwyg mode", async () => {
        await switchToWysiwygMode()
        await wait("wysiwyg_mode_error", { state: "hidden" })
    })
})
