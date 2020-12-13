import dynamic from "next/dynamic"
import React from "react"

const Loading = () => {
    return <p>loading</p>
}

export default function Index() {
    const DynamicEditor = dynamic(import("../view/EditorWrapper"), { ssr: false, loading: Loading })

    return (
        <>
            <h6>this page is only for development</h6>
            <DynamicEditor />
        </>
    )
}
