import Homepage from "@rino.app/home"
import React from "react"

import snapshot from "../../public/share/snapshot-mac-1317x762.png"

export default function Landing() {
    return <Homepage hero={{ imageSrc: snapshot }} />
}
