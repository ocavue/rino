export const TestHook = <T>({ callback }: { callback: () => T }) => {
    callback()
    return null
}

/**
 * use this function to mock "next/link"
 * https://github.com/vercel/next.js/issues/4012
 *
 * example:
 *
 * ```
 * jest.mock("next/link", () => mockNextLink)
 * ```
 *
 */
export function mockNextLink({ children }: any) {
    return children
}
