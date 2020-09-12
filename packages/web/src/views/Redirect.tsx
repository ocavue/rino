import { getHomeHostName } from "@rino.app/common"
import React from "react"

import Center from "./Center"

export default function Redirect() {
    console.warn("not login")
    const homeHost = getHomeHostName({ protocol: true })
    setTimeout(() => {
        console.log(`redirecting to ${homeHost}`)
        // window.location.replace(...) is better than using window.location.href, because replace()
        // does not keep the originating page in the session history, meaning the user won't get
        // stuck in a never-ending back-button fiasco.
        window.location.replace(homeHost)
    }, 0)
    return (
        <Center>
            <div>redirecting to {homeHost}</div>
        </Center>
    )
}
