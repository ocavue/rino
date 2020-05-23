export const TestHook = <T>({ callback }: { callback: () => T }) => {
    callback()
    return null
}
