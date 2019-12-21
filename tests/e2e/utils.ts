import os from "os"
import { WaitForSelectorOptions, ClickOptions, DirectNavigationOptions } from "puppeteer"

const testidSelector = (testid: string) =>
    /^[a-zA-Z0-9]+$/.exec(testid) ? `[data-testid=${testid}]` : `[data-testid="${testid}"]`

export async function goto(url: string, options?: DirectNavigationOptions) {
    url = url.startsWith("/") ? "http://localhost:8080" + url : url
    return page.goto(url, options)
}

export async function wait(testid: string, options?: WaitForSelectorOptions) {
    return page.waitForSelector(testidSelector(testid), options)
}

export async function focus(testid: string) {
    await wait(testid)
    return page.focus(testidSelector(testid))
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

export async function click(testid: string, options?: ClickOptions) {
    await wait(testid)
    return page.click(testidSelector(testid), options)
}

export async function sleep(ms: number) {
    return page.waitFor(ms)
}

export async function type(testid: string, text: string, pressEnter = true) {
    await wait(testid)
    await page.type(testidSelector(testid), text, { delay: 5 })
    if (pressEnter) await pressKey("Enter")
}

export async function getOne(testid: string) {
    return await page.$(testidSelector(testid))
}

export async function getAll(testid: string) {
    return await page.$$(testidSelector(testid))
}

export async function getInnerText(testid: string) {
    await wait(testid)
    const elementHandle = await getOne(testid)
    expect(elementHandle).toBeTruthy()
    const innerText: string = await page.evaluate(e => e.innerText, elementHandle)
    return innerText
}

export async function getTextAreaValue(testid: string) {
    await wait(testid)
    const textareaHandle = await getOne(testid)
    expect(textareaHandle).toBeTruthy()
    const value: string = await page.evaluate(t => t.value, textareaHandle)
    return value
}

export const wysiwygEditorSelector =
    testidSelector("editor") + " > " + testidSelector("wysiwyg-mode-textarea")

export async function getSourceCodeModeText() {
    return await getTextAreaValue("source-code-mode-textarea")
}

export async function waitAnimation<T>(promise: Promise<T>, ms = 500): Promise<T> {
    const T = await promise
    await sleep(ms)
    return T
}

export async function retry(
    fn: () => Promise<boolean> | boolean,
    timeout = 5000,
): Promise<boolean> {
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
    type Selectors = Record<
        string,
        { exists: boolean; childrenNumber: number | null; childrenTags?: string[] }
    >

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
        const selectors: Selectors = JSON.parse(selectorsJson)
        for (const [selector, info] of Object.entries(selectors)) {
            const element = document.querySelector(selector)
            if (!element) {
                info.exists = false
            } else if (
                info.childrenNumber !== null &&
                info.childrenNumber !== element.children.length
            ) {
                info.childrenNumber = element.children.length
                info.childrenTags = Array(element.children.length)
                    .fill(0)
                    .map((_, i) => element.children.item(i) as Element)
                    .map(e => e.tagName)
            }
        }
        return selectors
    }, JSON.stringify(expectedSelectors))

    expect(receivedSelectors).toEqual(expectedSelectors)
}
