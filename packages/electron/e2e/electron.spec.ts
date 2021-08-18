import { spawnSync } from "child_process"
import path from "path"
import playwright from "playwright-chromium"
import { fileURLToPath } from "url"

const electron = playwright._electron

const packageRoot = path.join(path.dirname(fileURLToPath(import.meta.url)), "..")
const setupPath = path.join(packageRoot, "setup.sh")

describe("smoke test", () => {
    beforeAll(() => {
        expect(packageRoot.endsWith("packages/electron")).toBeTruthy()
        spawnSync(setupPath)
    })

    let app: playwright.ElectronApplication
    let win: playwright.Page
    test("launch", async () => {
        app = await electron.launch({
            args: [packageRoot],
        })
        expect(app).toBeTruthy()
    })
    test("window", async () => {
        win = await app.firstWindow()
        await win.waitForSelector("[data-testid=wysiwyg_mode_textarea]", { timeout: 5000 })
    })
    test("close window", async () => {
        await win.close()
    })
    test("close window", async () => {
        await app.close()
    })
})
