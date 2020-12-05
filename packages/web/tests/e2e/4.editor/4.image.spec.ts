import { cleanNotes, createNote, login } from "../actions"
import { type as typeByTestid, wysiwygEditorSelector } from "../utils"

beforeAll(async () => {
    await login()
    await createNote()
})

afterAll(async () => {
    await cleanNotes()
})

async function type(text: string, pressEnter = true) {
    await typeByTestid("wysiwyg_mode_textarea", text, pressEnter)
}

describe("HTML", () => {
    describe("Image", () => {
        const imageSelector = `${wysiwygEditorSelector} img`

        beforeAll(async () => {
            await page.waitForSelector(imageSelector, { hidden: true })
        })

        test("Input", async () => {
            await type("h1")
            await type("![Image](https://via.placeholder.com/100/)", false)
        })

        test("Check", async () => {
            await page.waitForSelector(imageSelector)
        })
    })
})
