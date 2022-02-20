export const createDisableLogPlugin = () => {
    return {
        name: "vite-plugin-rvite-disable-log",
        enforce: "pre",
        config(config) {
            config.logLevel = config.logLevel || "warn"
        },
    }
}
