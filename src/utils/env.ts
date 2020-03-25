export function isTestEnv() {
    return process.env.NODE_ENV === "development" || process.env.REACT_APP_TESTING
}
