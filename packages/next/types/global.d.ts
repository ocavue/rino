// .md and .txt files will be transformed to string by webpack `raw-loader`
declare module "*.md" {
    const value: string
    export = value
}

declare module "*.txt" {
    const value: string
    export = value
}

// .svg files will be transformed to React components by `babel-plugin-inline-react-svg`
declare module "*.svg" {
    const value: React.FC<{ alt?: string; width?: string; height?: string }>
    export = value
}

// other image files will be transformed to objects by webpack `responsive-loader`
type ResponsiveLoaderImage = {
    images: Array<{
        path: string
        width: number
        height: number
    }>
    width: number
    height: number
    placeholder: string
    src: string
    srcSet: string
}

declare module "*.jpeg" {
    const value: ResponsiveLoaderImage
    export = value
}

declare module "*.jpg" {
    const value: ResponsiveLoaderImage
    export = value
}

declare module "*.png" {
    const value: ResponsiveLoaderImage
    export = value
}

declare module "*.webp" {
    const value: ResponsiveLoaderImage
    export = value
}
