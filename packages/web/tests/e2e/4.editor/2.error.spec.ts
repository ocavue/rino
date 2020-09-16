import { createEmptyNote, login, switchMode } from "../actions"
import { getInnerText, getSourceCodeModeText, type, wait } from "../utils"

describe("ProsemirrorView constructor error", () => {
    test("Prepare", async () => {
        await login()
        await createEmptyNote()
    })

    test("Make the alert message", async () => {
        await switchMode() // Switch to source code mode
        await type("source_code_mode_textarea", "HOOK:FAILED_TO_INIT_PROSEMIRROR_VIEW")
        await switchMode() // Switch back to wysiwyg code mode
        const error = await getInnerText("wysiwyg_mode_error")
        expect(error).toContain("Something went wrong.\n\nError: Found error hook for testing")
    })

    test("Switch to source code mode", async () => {
        await switchMode() // Switch to source code mode, which should works
        const text = await getSourceCodeModeText()
        expect(text.trim()).toEqual("HOOK:FAILED_TO_INIT_PROSEMIRROR_VIEW")
    })

    test("Fix text in the source code mode", async () => {
        await type("source_code_mode_textarea", "something")
    })

    test("Switch back to wysiwyg mode", async () => {
        await switchMode()
        await wait("wysiwyg_mode_error", { hidden: true })
    })
})
