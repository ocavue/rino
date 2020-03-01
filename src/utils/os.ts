export function isMac(): boolean {
    // https://stackoverflow.com/a/27862868
    return typeof navigator !== "undefined" ? navigator.platform.includes("Mac") : false
}

export const metaKey = isMac() ? "metaKey" : "ctrlKey"
