import { WaitForSelectorOptions, ClickOptions, DirectNavigationOptions } from "puppeteer"

const testidSelector = (testid: string) => `[data-testid="${testid}"]`

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

export async function pressKey(...keys: string[]) {
    for (let key of keys) {
        await page.keyboard.down(key)
    }
    for (let key of keys.reverse()) {
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

export async function type(testid: string, text: string) {
    await wait(testid)
    await page.type(testidSelector(testid), text, { delay: 5 })
    await pressKey("Enter")
}

export async function getOne(testid: string) {
    return await page.$(testidSelector(testid))
}

export async function getAll(testid: string) {
    return await page.$$(testidSelector(testid))
}

export async function getInnerText(testid: string) {
    await wait(testid)
    let elementHandle = await getOne(testid)
    expect(elementHandle).toBeTruthy()
    let innerText: string = await page.evaluate(e => e.innerText, elementHandle)
    return innerText
}

export async function getTextAreaValue(testid: string) {
    await wait(testid)
    let textareaHandle = await getOne(testid)
    expect(textareaHandle).toBeTruthy()
    let value: string = await page.evaluate(t => t.value, textareaHandle)
    return value
}

export const wysiwygEditorSelector =
    testidSelector("editor") + " > " + testidSelector("wysiwyg-mode-textarea")

export async function getSourceCodeModeText() {
    return await getTextAreaValue("source-code-mode-textarea")
}

export async function waitAnimation<T>(promise: Promise<T>, ms: number = 500): Promise<T> {
    const T = await promise
    await sleep(ms)
    return T
}

export async function retry(fn: () => Promise<boolean>, timeout = 5000): Promise<boolean> {
    const maxTime = Date.now() + timeout
    while (Date.now() < maxTime) {
        const result = await fn()
        if (result) return true
        else await sleep(100)
    }
    return false
}
