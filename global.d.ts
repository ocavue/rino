declare module "*.md" {
    const value: string
    export = value
}

declare module "*.txt" {
    const value: string
    export = value
}

// .svg files will be transform to React components by `babel-plugin-inline-react-svg`
declare module "*.svg" {
    const value: React.FC
    export = value
}

declare module "*.jpeg" {
    const value: string
    export = value
}

declare module "*.jpg" {
    const value: string
    export = value
}

declare module "*.png" {
    const value: string
    export = value
}

declare module "*.gif" {
    const value: string
    export = value
}

declare module "*.ico" {
    const value: string
    export = value
}

declare module "*.webp" {
    const value: string
    export = value
}

declare module "*.jp2" {
    const value: string
    export = value
}
