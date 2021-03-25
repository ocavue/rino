/* Copyright (c) 2020-present ocavue@gmail.com */

import React from "react"

import snapshot from "../assets/share/snapshot-mac.png"
import { Homepage } from "../components/homepage"

export default function Index() {
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
