// image files will be transformed to base64 string by `@rollup/plugin-image`
declare module "*.svg" {
    const value: string
    export = value
}

declare module "*.png" {
    const value: string
    export = value
}
