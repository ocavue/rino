export function createTimeoutPromise<T, P>(promise: Promise<T>, timeoutMs: number, fallbackReturn: P): Promise<T | P> {
    const timeoutPromise = new Promise<P>((resolve, reject) => {
        setTimeout(() => resolve(fallbackReturn), timeoutMs)
    })
    return Promise.any([promise, timeoutPromise])
}
