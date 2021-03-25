/* Copyright (c) 2020-present ocavue@gmail.com */

import dynamic from "next/dynamic"
import React from "react"

const Loading = () => {
    return <p>loading Editor</p>
}

const Main = () => {
    const DynamicEditor = dynamic(import("../view/EditorWrapper"), { ssr: false, loading: Loading })
    return <DynamicEditor />
}

export default Main
