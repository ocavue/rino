import "../remedy.css"

import { BaseApp } from "@rino.app/next/dist/app"
import React from "react"

export default function MyApp<T>({
    Component,
    pageProps,
}: {
    Component: React.FC<T>
    pageProps: T
}) {
    return (
        <BaseApp>
            <Component {...pageProps} />
        </BaseApp>
    )
}
