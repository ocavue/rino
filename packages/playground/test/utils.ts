import fs from "node:fs/promises"
import { dirname, join } from "node:path"
import { fileURLToPath } from "node:url"
import os from "os"
import { Dialog, ElementHandle } from "playwright-chromium"
import type { EditorView } from "prosemirror-view"

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

page.setDefaultTimeout(5000)

const testidSelector = (testid: string) => `[data-testid="${testid}"]`

type PageWaitForSelectorOptions = Parameters<typeof page.waitForSelector>[1]
type PageWaitForSelectorOptionsNotHidden = PageWaitForSelectorOptions & {
    state?: "visible" | "attached"
}

export async function wait(testid: string, options?: PageWaitForSelectorOptionsNotHidden): Promise<ElementHandle<SVGElement | HTMLElement>>
export async function wait(testid: string, options?: PageWaitForSelectorOptions): Promise<ElementHandle<SVGElement | HTMLElement> | null>
export async function wait(testid: string, options?: PageWaitForSelectorOptions): Promise<ElementHandle<SVGElement | HTMLElement> | null> {
    if (options) {
        return page.waitForSelector(testidSelector(testid), options)
    } else {
        return page.waitForSelector(testidSelector(testid))
    }
}

const metaKey = (() => {
    switch (os.platform()) {
        case "darwin":
            return "Meta"
        case "win32":
            return "Control"
        case "linux":
            return "Control"
        default:
            throw new Error(`Unsupport OS: ${os.platform()}`)
    }
})()

export async function pressKey(...keys: string[]) {
    for (let key of keys) {
        if (key === "Meta") key = metaKey
        await page.keyboard.down(key)
    }
    for (let key of keys.reverse()) {
        if (key === "Meta") key = metaKey
        await page.keyboard.up(key)
    }
}

export async function setupEditor(content?: string) {
    const url = new URL("http://localhost:3001")
    if (typeof content === "string") {
        url.searchParams.append("content", content)
        url.searchParams.append("contentid", "customize")
    }
    url.searchParams.append("devtools", "false")
    await page.goto(url.href)
}

export async function setupEmptyEditor() {
    return await setupEditor("")
}

export async function focus(testid: string) {
    await wait(testid)
    return page.focus(testidSelector(testid))
}

export const click: typeof page.click = async (testid: string, options) => {
    await wait(testid)
    return page.click(testidSelector(testid), options)
}

export async function sleep(ms: number) {
    return await page.waitForTimeout(ms)
}

async function typeWithSelector(selector: string, text: string, pressEnter = true) {
    await page.waitForSelector(selector, { timeout: 1000 })
    await page.type(selector, text, { delay: 2 })
    if (pressEnter) await pressKey("Enter")
}

export async function type(testid: string, text: string, pressEnter = true) {
    return typeWithSelector(testidSelector(testid), text, pressEnter)
}

export async function typeCodeMirror(testid: string, text: string, pressEnter = true) {
    return typeWithSelector(testidSelector(testid) + " .cm-editor .cm-content", text, pressEnter)
}

export async function typeWysiwygEditor(text: string, pressEnter = true) {
    return type("wysiwyg_mode_textarea", text, pressEnter)
}

export async function typeSourceCodeEditor(text: string, pressEnter = true) {
    return typeCodeMirror("source_code_mode_textarea", text, pressEnter)
}

export async function getOne(testid: string): Promise<ElementHandle<SVGElement | HTMLElement> | null> {
    return await page.$(testidSelector(testid))
}

export async function mustGetOne(testid: string): Promise<ElementHandle<SVGElement | HTMLElement>> {
    for (let i = 0; i < 3; i++) {
        const element = await getOne(testid)
        if (element) {
            return element
        }
        await sleep(500)
    }
    throw new Error("failed to find element by testid " + JSON.stringify(testid))
}

export async function getAll(testid: string): Promise<ElementHandle<SVGElement | HTMLElement>[]> {
    return await page.$$(testidSelector(testid))
}

function expectString(value: any): string {
    if (typeof value !== "string") {
        expect(typeof value).toEqual("string")
        throw new Error("should be a string")
    }
    return value
}

export async function getInnerText(testid: string): Promise<string> {
    const elementHandle = await mustGetOne(testid)
    const innerText = await elementHandle.innerText()
    return expectString(innerText)
}

export async function getTextAreaValue(testid: string): Promise<string> {
    const textareaHandle = await mustGetOne(testid)
    const value = await textareaHandle.getAttribute("value")
    return expectString(value)
}

export const wysiwygEditorSelector = testidSelector("wysiwyg_mode_textarea")
export const sourceCodeEditorSelector = testidSelector("source_code_mode_textarea")

export async function getSourceCodeModeText() {
    const cmContentHandle = await page.$(testidSelector("source_code_mode_textarea") + " .cm-content")
    if (!cmContentHandle) {
        throw new Error("failed to find .cm-content element")
    }
    return await cmContentHandle.evaluate((cmContent) => {
        return Array.from(cmContent.querySelectorAll(".cm-line"))
            .map((e) => e.textContent)
            .join("\n")
    })
}

export async function waitAnimation<T>(promise: Promise<T>, ms = 500): Promise<T> {
    const result = await promise
    await sleep(ms)
    return result
}

export async function getDimensions(testid: string) {
    // https://developer.mozilla.org/en-US/docs/Web/API/CSS_Object_Model/Determining_the_dimensions_of_elements
    await wait(testid)
    const element = await mustGetOne(testid)
    expect(element).toBeTruthy()
    return await page.evaluate((e) => {
        const { x, y, width, height, top, right, bottom, left } = e.getBoundingClientRect()
        return { x, y, width, height, top, right, bottom, left }
    }, element)
}

export async function retry(fn: () => Promise<boolean> | boolean, timeout = 5000): Promise<boolean> {
    const maxTime = Date.now() + timeout
    while (Date.now() <= maxTime) {
        const promiseOrBoolean = fn()
        const result: boolean = await Promise.resolve(promiseOrBoolean)
        if (result) return true
        else await sleep(100)
    }
    return false
}

type Shape = string | { [selector: string]: Shape[] }
export async function expectWysiwygHtml(shapes: Shape[]) {
    type Selectors = Record<string, { exists: boolean; childrenNumber: number | null; childrenTags?: string[] }>

    function buildExpectedSelectors(selector: string, shapes: Shape[]) {
        const selectors: Selectors = {}
        selectors[selector] = { childrenNumber: shapes.length, exists: true }
        shapes.forEach((shape: Shape, index) => {
            if (typeof shape === "string") {
                const childSelector = `${selector} > ${shape}:nth-child(${index + 1})`
                selectors[childSelector] = { childrenNumber: null, exists: true }
            } else {
                expect(Object.keys(shape)).toHaveLength(1)
                const key = Object.keys(shape)[0]
                const childSelector = `${selector} > ${key}:nth-child(${index + 1})`
                Object.assign(selectors, buildExpectedSelectors(childSelector, shape[key]))
            }
        })
        return selectors
    }
    const expectedSelectors: Selectors = buildExpectedSelectors(`${wysiwygEditorSelector}`, shapes)

    const receivedSelectors = await page.evaluate((selectorsJson: string) => {
        const selectors = JSON.parse(selectorsJson) as Selectors

        // `for ... of Object.entries(selectors)` seems have some babel issues, so I use ancient JS syntex here
        for (const selector in selectors) {
            // eslint-disable-next-line no-prototype-builtins
            if (!selectors.hasOwnProperty(selector)) {
                continue
            }
            const info = selectors[selector]
            const element = document.querySelector(selector)
            if (!element) {
                info.exists = false
            } else if (info.childrenNumber !== null && info.childrenNumber !== element.children.length) {
                info.childrenNumber = element.children.length
                info.childrenTags = Array(element.children.length)
                    .fill(0)
                    .map((_, i) => element.children[i])
                    .map((e) => e.tagName)
            }
        }
        return selectors
    }, JSON.stringify(expectedSelectors))

    expect(receivedSelectors).toEqual(expectedSelectors)
}

export function getDialog(callback: () => Promise<void>, timeout = 1000): Promise<Dialog | null> {
    return new Promise((resolve) => {
        let resolved = false
        function handleDialog(dialog: Dialog) {
            if (!resolved) {
                resolved = true
                page.removeListener("dialog", handleDialog)
                void dialog.dismiss().then(() => resolve(dialog))
            }
        }
        page.on("dialog", handleDialog)
        void callback().then(() =>
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

export function debugPrintLog() {
    page.on("console", (msg) => console.log("console:", msg.text()))
    page.on("pageerror", (error) => {
        console.log("pageerror:", error.message)
    })
    page.on("response", (response) => {
        console.log("response:", response.status(), response.url())
    })
    page.on("requestfailed", (request) => {
        console.log("requestfailed:", request.failure()?.errorText, request.url)
    })
}

export async function debugPrintScreenshot() {
    const screenshot = await page.screenshot({
        type: "png",
    })
    console.log("base64 screenshot:\n", screenshot.toString("base64"))
}

export async function debugPrintBodyInnerHTML() {
    const bodyHandler = await page.$("body")
    const innerHTML = await bodyHandler?.evaluate((body) => {
        return body.innerHTML
    })
    console.log("body.innerHTML:\n", innerHTML)
}

export async function getDocJson() {
    return await page.$$eval("body", () => {
        const view = (window as any)._RINO_EDITOR_VIEW as EditorView
        if (!view) {
            throw new Error("No editor view found")
        }
        return view.state.doc.toJSON()
    })
}

export async function expectWysiwygMode() {
    await wait("wysiwyg_mode_textarea")
    await wait("source_code_mode_textarea", { state: "hidden" })
}

export async function expectSourceCodeMode() {
    await wait("source_code_mode_textarea")
    await wait("wysiwyg_mode_textarea", { state: "hidden" })
}

export async function writeSnapshotImage(fileName: string) {
    const filePath = join(__dirname, "__img_snapshots__", fileName)
    await fs.mkdir(dirname(filePath), { recursive: true })
    const screenshot = await page.screenshot({ type: "png", fullPage: true })
    await fs.writeFile(filePath, screenshot)
}
