/* Copyright (c) 2020-present ocavue@gmail.com */

export function isTestEnv(): boolean {
    return !!(process.env.NODE_ENV === "development" || process.env.REACT_APP_TESTING)
}
