import "../remedy.css"

import React from "react"

export default function MyApp<T>({
    Component,
    pageProps,
}: {
    Component: React.FC<T>
    pageProps: T
}) {
    return <Component {...pageProps} />
}
