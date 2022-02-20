// https://github.com/vercel/next.js//blob/c5291406aa884e3b6b315b63c1ddbbc2f4b1fc2a/packages/next/pages/_error.tsx#L1

import React from "react"
// import { Head } from "rvite/head"

const statusCodes = {
    400: "Bad Request",
    404: "This page could not be found",
    405: "Method Not Allowed",
    500: "Internal Server Error",
}

/**
 * `Error` component used for handling errors.
 */
const Error = () => {
    const statusCode = 404
    const title = statusCodes[statusCode] || "An unexpected error has occurred"

    return (
        <div style={styles.error}>
            {/* <Head> */}
            {/* <title>{statusCode ? `${statusCode}: ${title}` : "Application error: a client-side exception has occurred"}</title> */}
            {/* </Head> */}
            <div>
                <style dangerouslySetInnerHTML={{ __html: "body { margin: 0 }" }} />
                {statusCode ? <h1 style={styles.h1}>{statusCode}</h1> : null}
                <div style={styles.desc}>
                    <h2 style={styles.h2}>
                        {title || statusCode ? (
                            title
                        ) : (
                            <>Application error: a client-side exception has occurred (see the browser console for more information)</>
                        )}
                        .
                    </h2>
                </div>
            </div>
        </div>
    )
}

Error.displayName = "ErrorPage"

export default Error

const styles = {
    error: {
        color: "#000",
        background: "#fff",
        fontFamily:
            '-apple-system, BlinkMacSystemFont, Roboto, "Segoe UI", "Fira Sans", Avenir, "Helvetica Neue", "Lucida Grande", sans-serif',
        height: "100vh",
        textAlign: "center",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
    },

    desc: {
        display: "inline-block",
        textAlign: "left",
        lineHeight: "49px",
        height: "49px",
        verticalAlign: "middle",
    },

    h1: {
        display: "inline-block",
        borderRight: "1px solid rgba(0, 0, 0,.3)",
        margin: 0,
        marginRight: "20px",
        padding: "10px 23px 10px 0",
        fontSize: "24px",
        fontWeight: 500,
        verticalAlign: "top",
    },

    h2: {
        fontSize: "14px",
        fontWeight: "normal",
        lineHeight: "inherit",
        margin: 0,
        padding: 0,
    },
}
