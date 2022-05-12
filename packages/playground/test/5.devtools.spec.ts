import { click, setupEditor, wait } from "./utils"

const toolkitButtonSelector = ".__prosemirror-dev-toolkit__ button.floating-btn"
const toolkitDockSelector = ".__prosemirror-dev-toolkit__ div.floating-dock"

test("devtools", async () => {
    await setupEditor()
    await wait("playground_debug_console", { state: "hidden" })

    await click("playground_debug_button")
    await wait("playground_debug_console")

    await page.waitForSelector(toolkitDockSelector, { state: "hidden" })
    await page.waitForSelector(toolkitButtonSelector)

    await page.click(toolkitButtonSelector)
    await page.waitForSelector(toolkitDockSelector)
})
