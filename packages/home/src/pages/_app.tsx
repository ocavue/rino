import "../remedy.css"

import React from "react"

import { BaseApp } from "@rino.app/next/dist/app"

export default function MyApp<T>({ Component, pageProps }: { Component: React.FC<T>; pageProps: T }) {
    return (
        <BaseApp>
            <Component {...pageProps} />
        </BaseApp>
    )
}
