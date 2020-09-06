import { getHomeHostName } from "@rino.app/common"

import { DynamicPage } from "src/utils"

export default DynamicPage("Index", () => {
    if (localStorage?.getItem("__rino_dev_auth_state") === "yes") {
        // TODO: don't need to use import here
        return import("src/views/Workspace")
    } else {
        // This is weird because the server should return a 302 response and the client don't need to do the redirect job.
        console.warn("not login")
        const homeHost = getHomeHostName({ protocol: true })
        console.log(`redirecting to ${homeHost}`)
        // TODO: how to sign-in in lighthouse testing.

        // window.location.replace(...) is better than using window.location.href, because replace() does
        // not keep the originating page in the session history, meaning the user won't get stuck in a
        // never-ending back-button fiasco.
        window.location.replace(homeHost)
    }
})
