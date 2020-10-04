export function generateRandomId(): string {
    // https://stackoverflow.com/a/13403498
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
}
