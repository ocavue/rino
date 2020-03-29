import { NextPageContext } from "next"
import React from "react"

import Alert from "src/views/Alert"

// Some common status codes
const statusCodeMap: Record<string, string> = {
    "400": "Bad Request",
    "401": "Unauthorized",
    "403": "Forbidden",
    "404": "This page could not be found.",
    "405": "Method Not Allowed",
    "408": "Request Timeout",
    "421": "Misdirected Request",
    "429": "Too Many Requests",
    "500": "Internal Server Error",
    "502": "Bad Gateway",
    "503": "Service Unavailable",
    "504": "Gateway Timeout",
}

function Error(props: { statusCode?: number }) {
    // In static build, `statusCode` is empty since `getInitialProps` will not be executed.
    const code = String(props.statusCode || 404)
    const message = statusCodeMap[code] || `The server return status code "${code}".`
    return <Alert title={code} message={message} />
}

Error.getInitialProps = ({ res, err }: NextPageContext) => {
    const statusCode = res ? res.statusCode : err ? err.statusCode : 404
    return { statusCode }
}

export default Error
