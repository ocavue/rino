export function all(items: unknown[]) {
    for (const item of items) {
        if (!item) return false
    }
    return true
}

export function any(items: unknown[]) {
    for (const item of items) {
        if (item) return true
    }
    return false
}
