/* Copyright (c) 2020-present ocavue@gmail.com */

import { NextPage } from "next"
import dynamic, { Loader } from "next/dynamic"
import React from "react"

import Loading from "src/views/Loading"

export function DynamicPage<P>(displayName: string, dynamicOptions: Loader<P>) {
    const View = dynamic(dynamicOptions, { ssr: false, loading: Loading })
    const Page: NextPage<P> = (props: P) => {
        return <View {...props} />
    }
    Page.displayName = displayName
    return Page
}
