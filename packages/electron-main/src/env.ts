const NODE_ENV = process.env.NODE_ENV || "production"

export const env = {
    IS_PROD: NODE_ENV === "production",
    IS_DEV: NODE_ENV === "development",
    IS_TEST: NODE_ENV === "test",
}

export const plateform = {
    IS_MAC: process.platform === "darwin",
    IS_WINDOWS: process.platform === "win32",
    IS_LINUX: process.platform === "linux",
}

export const COMMIT_SHA: string | undefined = (import.meta.env.VITE_APP_GIT_COMMIT_SHA as string) || undefined
