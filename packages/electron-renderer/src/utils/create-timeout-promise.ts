export function createTimeoutPromise<T>(promise: Promise<T>, timeoutMs: number): Promise<T | void> {
    const timeoutPromise = new Promise<void>((resolve) => {
        setTimeout(resolve, timeoutMs)
    })
    return Promise.any([promise, timeoutPromise])
}
