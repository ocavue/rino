import dynamic from "next/dynamic"
import React from "react"

const Loading = () => {
    return <p>loading Main</p>
}

const Index = () => {
    const Main = dynamic(import("../view/Main"), { ssr: false, loading: Loading })
    return (
        <>
            <span className="dev-header">notice: this page is only for development</span>
            <Main />
        </>
    )
}

export default Index
