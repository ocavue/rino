export function isTestEnv(): boolean {
    return !!(process.env.NODE_ENV === "development" || process.env.REACT_APP_TESTING)
}
