const NODE_ENV = process.env.NODE_ENV || "production"

const env = {
    IS_PROD: NODE_ENV === "production",
    IS_DEV: NODE_ENV === "deployment",
    IS_TEST: NODE_ENV === "test",
}

export { env }
