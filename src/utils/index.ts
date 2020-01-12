export function generateRandomId(): string {
    // https://stackoverflow.com/a/13403498
    return (
        Math.random()
            .toString(36)
            .substring(2, 15) +
        Math.random()
            .toString(36)
            .substring(2, 15)
    )
}

export function isMac(): boolean {
    // https://stackoverflow.com/a/27862868
    return typeof navigator !== "undefined" ? navigator.platform.includes("Mac") : false
}

export { noSsrPage, DynamicPage } from "./page"
