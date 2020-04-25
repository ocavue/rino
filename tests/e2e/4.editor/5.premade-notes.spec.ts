import { signOut } from "../actions"
import { click, type } from "../utils"

describe("Permade notes", function () {
    test("Open a premade note", async () => {
        await signOut()
        await click("sidebar-notes-list-item-local")
    })
    test("Input", async () => {
        await type("wysiwyg-mode-textarea", "aaaaaaaaa")
    })
})
