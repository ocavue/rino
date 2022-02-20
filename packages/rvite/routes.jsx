import React from "react"
import { Route, Routes } from "react-router-dom"

// const pages = {
//     '/src/pages/Foo.jsx': () => import('/src/pages/Foo.jsx'),
//     '/src/pages/Bar.tsx': () => import('/src/pages/Bar.tsx')
//   }
export const pages = import.meta.glob("/src/pages/*.(jsx|js|tsx|ts)")

const urlToComponent = {}

Object.entries(pages).map(([page, pageImport]) => {
    // console.log('path:', '['+path+']')

    const name = page.toLowerCase().match(/\/pages\/(.*)\.(jsx|js|tsx|ts)$/)[1]
    const path = name === "index" ? "/" : "/" + name

    urlToComponent[path] = pageImport
})

export async function importPageCompoment(url) {
    const pageImport = urlToComponent[url]
    if (!pageImport) {
        let message = `Failed to find page. Received url is ${url}. Expected urls are ${Object.keys(urlToComponent).join(", ")}.`
        throw new Error(message)
    }
    return (await pageImport()).default
}

export async function buildPageRoutes(url) {
    // console.log("[PageRoutes] url:", url)

    const routes = []
    let notFoundRoute = null

    for (let [path, pageImport] of Object.entries(urlToComponent)) {
        // console.log("[PageRoutes] path:", path)

        if (path == url) {
            const Page = await importPageCompoment(url)
            routes.push(<Route key={path} path={path} element={<Page />} />)
        } else if (path == "_error") {
            const Page = React.lazy(pageImport)
            notFoundRoute = <Route key={path} path={path} element={<Page />} />
        } else {
            const Page = React.lazy(pageImport)
            routes.push(<Route key={path} path={path} element={<Page />} />)
        }
    }

    if (notFoundRoute) {
        routes.push(notFoundRoute)
    }

    const PageRoutes = () => (
        <React.Suspense>
            <Routes>{routes}</Routes>
        </React.Suspense>
    )
    PageRoutes.displayName = "PageRoutes"
    return PageRoutes
}
