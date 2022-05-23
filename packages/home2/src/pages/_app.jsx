import "../components/styles.css"

import React from "react"
import { Link } from "react-router-dom"
import { Head } from "visite/head"

function MyApp({ Component, pageProps }) {
    // console.log("MyApp in:", !!Component)
    return (
        <>
            <Head>
                <title>Visite App</title>
                <html lang="en" />
            </Head>
            <ul>
                <li>
                    <Link to="/">Home</Link>
                </li>
                <li>
                    <Link to="/foo">Foo</Link>
                </li>
                <li>
                    <Link to="/bar">Bar</Link>
                </li>
                <li>
                    <Link to="/about">About</Link>
                </li>
                <li>
                    <Link to="/env">Env</Link>
                </li>
            </ul>

            <Component {...pageProps} />
        </>
    )
}

export default MyApp
