/* Copyright (c) 2020-present ocavue@gmail.com */

import { getSignInState } from "@rino.app/common"

import { DynamicPage } from "src/utils"

function isSignedInOrInDevelopment(): boolean {
    if (getSignInState()) {
        return true
    }
    if (process.env.NODE_ENV === "development" || process.env.REACT_APP_TESTING) {
        return true
    }
    return false
}

export default DynamicPage("Index", () => {
    if (isSignedInOrInDevelopment()) {
        return import("src/views/Workspace")
    } else {
        // In the production website, the server should return a 302 response and the client don't need to do the redirect job. This is only
        // for preview deployments.
        return import("src/views/Redirect")
    }
})
