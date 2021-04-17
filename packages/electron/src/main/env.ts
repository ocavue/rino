const NODE_ENV = process.env.NODE_ENV

const env = {
    NODE_ENV: NODE_ENV,
    MODE: NODE_ENV,
    PROD: NODE_ENV === "production" || NODE_ENV === undefined,
}

export { env }
