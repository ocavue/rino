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
    for (const key of keys) {
        await page.keyboard.down(key)
    }
    for (const key of keys.reverse()) {
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
