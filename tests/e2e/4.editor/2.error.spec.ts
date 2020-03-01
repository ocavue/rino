import { Dialog } from "puppeteer"
import { createEmptyNote } from "../actions"
import { getInnerText, getSourceCodeModeText, goto, pressKey, type } from "../utils"

function getDialog(callback: () => Promise<void>, timeout = 1000): Promise<Dialog | null> {
    return new Promise(resolve => {
        let resolved = false
        function handleDialog(dialog: Dialog) {
            if (!resolved) {
                resolved = true
                page.removeListener("dialog", handleDialog)
                dialog.dismiss().then(() => resolve(dialog))
            }
        }
        page.on("dialog", handleDialog)
        callback().then(() =>
            setTimeout(() => {
                if (!resolved) {
                    resolved = true
                    page.removeListener("dialog", handleDialog)
                    resolve(null)
                }
            }, timeout),
        )
    })
}

describe("ProsemirrorView constructor error", () => {
    test("Prepare", async () => {
        await goto("/")
        await createEmptyNote()
    })

    test("Make the alert message", async () => {
        await pressKey("Meta", "Slash") // Switch to source code mode
        await type("source-code-mode-textarea", "HOOK:FAILED_TO_INIT_PROSEMIRROR_VIEW")
        await pressKey("Meta", "Slash") // Switch back to wysiwyg code mode

        const error = await getInnerText("wysiwyg-mode-error")
        expect(error).toContain("Something went wrong.\n\nError: Found error hook for testing")
    })

    test("Switch to source code mode", async () => {
        await pressKey("Meta", "Slash") // Switch to source code mode, which should works
        const text = await getSourceCodeModeText()
        expect(text.trim()).toEqual("HOOK:FAILED_TO_INIT_PROSEMIRROR_VIEW")
    })

    test("Fix text in the source code mode", async () => {
        await type("source-code-mode-textarea", "something")
    })

    test("Switch back to wysiwyg mode", async () => {
        const dialog = await getDialog(() => pressKey("Meta", "Slash"))
        expect(dialog).toBeFalsy()
    })
})
