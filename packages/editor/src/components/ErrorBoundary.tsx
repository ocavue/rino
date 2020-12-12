import React from "react"

/* istanbul ignore next */
export class ErrorBoundary extends React.Component<unknown, { hasError: boolean }> {
    constructor(props) {
        super(props)
        this.state = { hasError: false }
    }

    static getDerivedStateFromError(error) {
        // Update state so the next render will show the fallback UI.
        return { hasError: true }
    }

    componentDidCatch(error, errorInfo) {
        // You can also log the error to an error reporting service
        console.error(error, errorInfo)
    }

    render() {
        if (this.state.hasError) {
            // You can render any custom fallback UI
            return <h1 data-testid="editor_error">Something went wrong.</h1>
        }

        return this.props.children
    }
}
