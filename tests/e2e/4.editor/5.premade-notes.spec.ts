import { click, type } from "../utils"
import { signOut } from "../actions"

describe("Permade notes", function() {
    test("Open a premade note", async () => {
        await signOut()
        await click("sidebar-notes-list-item")
    })
    test("Input", async () => {
        await type("wysiwyg-mode-textarea", "aaaaaaaaa")
    })
})
