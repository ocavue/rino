import { createNote, login, switchMode } from "../actions"
import { sleep, type } from "../utils"

describe("Firebase operation", () => {
    // App should not throw any error when doing firebase operations

    const microseconds = 5000 // Should be enough for firebase operations

    test("Create note", async () => {
        await login()
        await createNote()
        await sleep(microseconds)
    })

    test("Editor note", async () => {
        await type("wysiwyg_mode_textarea", "Something")
        await sleep(microseconds)
    })

    test("Switch editor", async () => {
        await switchMode()
        await sleep(microseconds)
    })
})
