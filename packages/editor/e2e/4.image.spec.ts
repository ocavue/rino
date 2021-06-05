import { setupEditor, type as typeByTestid, wysiwygEditorSelector } from "./utils"

beforeAll(async () => {
    await setupEditor()
})

async function type(text: string, pressEnter = true) {
    await typeByTestid("wysiwyg_mode_textarea", text, pressEnter)
}

describe("HTML", () => {
    describe("Image", () => {
        const imageSelector = `${wysiwygEditorSelector} img`

        beforeAll(async () => {
            await page.waitForSelector(imageSelector, { state: "hidden" })
        })

        test("Input", async () => {
            await type("hi")
            await type("![Image](/assets/placeholder.png)", false)
        })

        test("Check", async () => {
            await page.waitForSelector(imageSelector)
        })
    })
})
