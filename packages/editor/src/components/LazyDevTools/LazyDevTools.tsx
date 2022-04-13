import React, { Suspense } from "react"

const DevTools = React.lazy(() => {
    console.log("Loading DevTools...")
    return import("./DevTools")
})

const LazyDevTools: React.FC = () => {
    return (
        <Suspense>
            <DevTools />
        </Suspense>
    )
}

export default LazyDevTools
