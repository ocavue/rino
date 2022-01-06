export function formatHref(location: string): string {
    if (isUnixFilePath(location) || isWindowsFilePath(location)) {
        return formatFileUrl(location)
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

// Copied from https://github.com/sindresorhus/file-url/blob/186c35b83a0728c5cef65b88899b862bb6783603/index.js
function formatFileUrl(filePath: string, options = {}) {
    let pathName = filePath

    pathName = pathName.replace(/\\/g, "/")

    // Windows drive letter must be prefixed with a slash.
    if (pathName[0] !== "/") {
        pathName = `/${pathName}`
    }

    // Escape required characters for path components.
    // See: https://tools.ietf.org/html/rfc3986#section-3.3
    return encodeURI(`file://${pathName}`).replace(/[?#]/g, encodeURIComponent)
}
