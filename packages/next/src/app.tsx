import Head from "next/head"
import React from "react"

export function getAppHead() {
    return (
        <Head>
            <meta name="viewport" content="initial-scale=1.0, width=device-width" />{" "}
            <title>Rino</title>
        </Head>
    )
}

export const BaseApp: React.FC = ({ children }) => {
    return (
        <>
            <Head>
                <meta name="viewport" content="initial-scale=1.0, width=device-width" />
                <title>Rino</title>
            </Head>
            {children}
        </>
    )
}
