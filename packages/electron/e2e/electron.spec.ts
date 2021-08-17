import { spawnSync } from "child_process"
import path from "path"
import playwright from "playwright-chromium"
import { fileURLToPath } from "url"

const electron = playwright._electron

const packageRoot = path.join(path.dirname(fileURLToPath(import.meta.url)), "..")
const setupPath = path.join(packageRoot, "setup.sh")

test("launch", async () => {
    expect(packageRoot.endsWith("packages/electron")).toBeTruthy()
    spawnSync(setupPath)
    const app = await electron.launch({
        args: [packageRoot],
    })
    expect(app).toBeTruthy()
    const page = await app.firstWindow()
    await page.waitForSelector("[data-testid=wysiwyg_mode_textarea]")
    await page.close()
    await app.close()
})
