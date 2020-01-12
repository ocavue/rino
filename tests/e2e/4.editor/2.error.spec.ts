import { Dialog } from "puppeteer"
import { createEmptyNote, login } from "../actions"
import { getSourceCodeModeText, pressKey, type } from "../utils"

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
function expectDialog(dialog: Dialog | null, options: { message: string; type: string }) {
    if (!dialog) {
        expect(dialog).toBeTruthy()
    } else {
        expect(dialog.message()).toEqual(options.message)
        expect(dialog.type()).toEqual(options.type)
    }
}

describe("ProsemirrorView constructor error", () => {
    test("Prepare", async () => {
        await login()
        await createEmptyNote()
    })

    test("Make the alert dialog", async () => {
        const dialog = await getDialog(async function() {
            await type("wysiwyg-mode-textarea", "HOOK:FAILED_TO_INIT_PROSEMIRROR_VIEW")
            await pressKey("Meta", "Slash") // Switch to source code mode
            await pressKey("Meta", "Slash") // Switch back to wysiwyg code mode
        })
        expectDialog(dialog, {
            message: "Failed to load markown content:\nError: Found error hook for testing",
            type: "alert",
        })
    })

    test("Switch to source code mode", async () => {
        await pressKey("Meta", "Slash") // Switch to source code mode, which should works
        expect(await getSourceCodeModeText()).toEqual("HOOK:FAILED_TO_INIT_PROSEMIRROR_VIEW")
    })

    test("Fix text in the source code mode", async () => {
        await type("source-code-mode-textarea", "something")
    })

    test("Switch back to wysiwyg mode", async () => {
        const dialog = await getDialog(() => pressKey("Meta", "Slash"))
        expect(dialog).toBeFalsy()
    })
})
