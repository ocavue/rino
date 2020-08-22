import Homepage from "@rino.app/home"
import React from "react"

import snapshot from "../assets/share/snapshot-mac.png"

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
