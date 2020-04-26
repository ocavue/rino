// Since the package name is `rino.app/web`, someone may visit https://rino.app/web directly. To avoid
// 404 not found in this case, I added a redirect page.
import { useRouter } from "next/router"
import React from "react"

import Center from "src/views/Center"

function Redirect() {
    const router = useRouter()
    React.useEffect(() => {
        router.replace("/")
    })
    return <Center>Redirecting...</Center>
}

export default Redirect
