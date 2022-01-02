export function formatHref(location: string): string {
    if (isUnixFilePath(location) || isWindowsFilePath(location)) {
        return "file://" + location
    } else {
        return location
    }
}

function isUnixFilePath(location: string): boolean {
    return location.startsWith("/")
}

function isWindowsFilePath(location: string): boolean {
    return location.startsWith("\\") || /^[A-Z]{1,2}:/.test(location)
}
