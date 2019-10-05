import { WaitForSelectorOptions, ClickOptions, DirectNavigationOptions } from "puppeteer"

const testidSelector = (testid: string) => `[data-testid="${testid}"]`

export async function goto(url: string, options?: DirectNavigationOptions) {
    url = url.startsWith("/") ? "http://localhost:8080" + url : url
    return page.goto(url, options)
}

export async function wait(testid: string, options?: WaitForSelectorOptions) {
    return page.waitForSelector(testidSelector(testid), options)
}

export async function force(testid: string) {
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
    let elemenmHander = await getOne(testid)
    expect(elemenmHander).toBeTruthy()
    let innerText: string = await page.evaluate(e => e.innerText, elemenmHander)
    return innerText
}

export async function getTextAreaValue(testid: string) {
    await wait(testid)
    let textarea = await getOne(testid)
    expect(textarea).toBeTruthy()
    let text: string = await page.evaluate(textarea => textarea.value, textarea)
    return text
}
