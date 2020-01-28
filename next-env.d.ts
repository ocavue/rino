/// <reference types="next" />
/// <reference types="next/types/global" />
/// <reference types="next-images" />
/// <reference types="react-scripts" />

import "jest-extended"

declare module "*.png" {
    const value: any
    export = value
}

declare module "*.svg" {
    const value: any
    export = value
}

declare module "*.md" {
    const value: string
    export = value
}

declare module "*.txt" {
    const value: string
    export = value
}
