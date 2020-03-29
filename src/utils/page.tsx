import { NextPage } from "next"
import dynamic, { Loader } from "next/dynamic"
import React from "react"

export function noSsrPage<P>(dynamicOptions: Loader<P>) {
    return dynamic(dynamicOptions, { ssr: false })
}

export function DynamicPage<P>(displayName: string, dynamicOptions: Loader<P>) {
    const View = dynamic(dynamicOptions, { ssr: false })
    const Page: NextPage<P> = (props: P) => {
        return <View {...props} />
    }
    Page.displayName = displayName
    return Page
}
