import type { ServerEntry, ServerEntryContext } from "./types"

export async function injectHtml(renderFunc: ServerEntry, url: string, template: string) {
    const context: ServerEntryContext = {}
    // if (context.url) {
    //     // Somewhere a `<Redirect>` was rendered
    //     return res.redirect(301, context.url)
    // }
    const appHtml = await renderFunc(url, context)

    const headHtml = [
        context.helmet?.title.toString(),
        context.helmet?.link.toString(),
        context.helmet?.script.toString(),
        context.helmet?.meta.toString(),
        context.helmet?.base.toString(),
        context.helmet?.noscript.toString(),
        context.helmet?.style.toString(),
    ].join("")

    const htmlAttrs = context.helmet?.htmlAttributes.toString() || ""
    const bodyAttrs = context.helmet?.bodyAttributes.toString() || ""

    if (htmlAttrs) {
        template = template.replace(/<html([^>]*)>/, `<html$1 ${htmlAttrs}>`)
    }
    if (bodyAttrs) {
        template = template.replace(/<body([^>]*)>/, `<body$1 ${bodyAttrs}>`)
    }

    return template.replace(`<!--visite-placeholder-app-->`, appHtml).replace(`<!--visite-placeholder-head-->`, headHtml)
}
