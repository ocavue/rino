import { Button } from "@material-ui/core"
import React from "react"

import Alert from "src/views/Alert"

export default function NotFoundError() {
    const code = "404"
    const message = `The server return status code ${code}.`
    return (
        <Alert title={code} message={message}>
            <Button href="/" size="small" variant="outlined">
                Return homepage
            </Button>
        </Alert>
    )
}
