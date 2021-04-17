// Import Global CSS
// https://github.com/zeit/next.js/blob/v9.2.0/errors/css-global.md
import "../../../../node_modules/prosemirror-tables/style/tables.css"
import "../../../../node_modules/prosemirror-view/style/prosemirror.css"
import "../../../../node_modules/codemirror/lib/codemirror.css"
import "../../../../node_modules/codemirror/theme/nord.css"
import "../../src/style/develop.css"

import React from "react"

import { BaseApp } from "@rino.app/next/dist/app"

import App from "src/views/App"

export default function Root<T>({ Component, pageProps }: { Component: React.FC<T>; pageProps: T }) {
    return (
        <BaseApp>
            <App>
                <Component {...pageProps} />
            </App>
        </BaseApp>
    )
}
