import dynamic from "next/dynamic"
import React from "react"

const Loading = () => {
    return <p>loading Main...</p>
}

const Index = () => {
    const Main = dynamic(import("../view/Main"), { ssr: false, loading: Loading })
    return (
        <>
            <span className="dev-header">
                <p>notice: this page is only for development</p>
                <p>you can click the editor and press "Command + /" (on macOS/iOS) or "Ctrl + /" (on other OS) to swtich the mode</p>
            </span>
            <Main />
        </>
    )
}

export default Index
