import { DynamicPage } from "src/utils"

function isSignedIn(): boolean {
    if (typeof localStorage !== "undefined") {
        if (localStorage?.getItem("__rino_dev_auth_state") === "yes") {
            return true
        }
    }
    if (process.env.NODE_ENV === "development" || process.env.REACT_APP_TESTING) {
        return true
    }
    return false
}

export default DynamicPage("Index", () => {
    if (isSignedIn()) {
        return import("src/views/Workspace")
    } else {
        // This is weird because the server should return a 302 response and the client don't need
        // to do the redirect job.
        return import("src/views/Redirect")
    }
})
