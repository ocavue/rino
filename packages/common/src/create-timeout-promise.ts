import { sleep } from "./sleep"

async function sleepBeforeError(timeout: number): Promise<never> {
    await sleep(timeout)
    throw new Error(`timed out after ${timeout} milliseconds`)
}

export async function createTimeoutPromise<T>(promise: Promise<T>, delay: number): Promise<T> {
    return await Promise.race([promise, sleepBeforeError(delay)])
}
