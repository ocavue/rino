import { NextPageContext } from "next"
import React from "react"

function Error({ statusCode }: { statusCode: number }) {
    return <div data-testid={statusCode}>{statusCode}</div>
}

Error.getInitialProps = ({ res, err }: NextPageContext) => {
    const statusCode = res ? res.statusCode : err ? err.statusCode : 404
    return { statusCode }
}

export default Error
