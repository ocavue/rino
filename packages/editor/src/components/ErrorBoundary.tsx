/* istanbul ignore file */
import type { ErrorInfo, PropsWithChildren } from "react"
import React from "react"

class ErrorBoundary<Props> extends React.Component<PropsWithChildren<Props>, { hasError: boolean }> {
    constructor(props: Props) {
        super(props)
        this.state = { hasError: false }
    }

    static getDerivedStateFromError(error: Error) {
        // Update state so the next render will show the fallback UI.
        return { hasError: true }
    }

    componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        // You can also log the error to an error reporting service
        console.error("[ErrorBoundary]", error, errorInfo)
    }

    render() {
        if (this.state.hasError) {
            // You can render any custom fallback UI
            return <h1 data-testid="editor_error">Sorry, something went wrong!</h1>
        }

        return this.props.children
    }
}

export default ErrorBoundary
