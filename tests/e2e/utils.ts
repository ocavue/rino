import { Page } from "puppeteer"

function sleep(milliseconds: number) {
    return new Promise(resolve => setTimeout(resolve, milliseconds))
}

export async function waitForAsyncFunction(func: () => Promise<boolean>): Promise<void> {
    let result = await func()
    if (result) {
        return
    } else {
        await sleep(50)
        await waitForAsyncFunction(func)
    }
}

export async function waitForTestId(page: Page, testId: string) {
    return page.waitForSelector(`[data-testid="${testId}"]`)
}
