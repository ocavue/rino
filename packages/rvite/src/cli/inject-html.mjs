export async function injectHtml(renderFunc, url, template) {
    const context = {}
    // if (context.url) {
    //     // Somewhere a `<Redirect>` was rendered
    //     return res.redirect(301, context.url)
    // }
    const appHtml = await renderFunc(url, context)
    const headHtml = [
        context.helmet.title.toString(),
        context.helmet.link.toString(),
        context.helmet.script.toString(),
        context.helmet.meta.toString(),
        context.helmet.base.toString(),
        context.helmet.noscript.toString(),
        context.helmet.style.toString(),
    ].join("")
    return template.replace(`<!--rvite-app-html-->`, appHtml).replace(`<!--rvite-app-head-->`, headHtml)
}
