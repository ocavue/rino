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
