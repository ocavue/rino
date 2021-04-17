import "../../../node_modules/prosemirror-tables/style/tables.css"
import "../../../node_modules/prosemirror-view/style/prosemirror.css"
import "../../../node_modules/codemirror/lib/codemirror.css"
import "../../../node_modules/codemirror/theme/nord.css"

import React from "react"

import { BaseApp } from "@rino.app/next/dist/app"

export default function Root<T>({ Component, pageProps }: { Component: React.FC<T>; pageProps: T }) {
    return (
        <BaseApp>
            <Component {...pageProps} />
        </BaseApp>
    )
}
