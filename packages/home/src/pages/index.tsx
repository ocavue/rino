import React from "react"

import snapshot from "../assets/share/snapshot-mac.png"
import { Homepage } from "../components/homepage"

const IndexPage: React.FC = () => {
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

export default IndexPage
