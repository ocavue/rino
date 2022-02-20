import type { Plugin } from "vite"

export const createDisableLogPlugin = (): Plugin => {
    return {
        name: "vite-plugin-visite-disable-log",
        enforce: "pre",
        config: (config) => {
            config.logLevel = config.logLevel || "warn"
        },
    }
}
