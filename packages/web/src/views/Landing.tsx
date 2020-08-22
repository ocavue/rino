import Homepage from "@rino.app/home"
import React from "react"

import snapshot from "../../public/share/snapshot-mac-1317x762.png"

console.log("snapshot:", snapshot)

export default function Landing() {
    return (
        <Homepage
            hero={{
                imageProps: {
                    src: snapshot.src,
                    srcSet: snapshot.srcSet,
                    width: snapshot.width,
                    height: snapshot.height,
                    loading: "lazy",
                },
            }}
        />
    )
}
