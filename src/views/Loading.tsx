import React from "react"

import Center from "./Center"

export function Loading() {
    return (
        <Center>
            <div>
                <img src="/img/icons/safari-pinned-tab.svg" style={{ width: "100px" }} />
            </div>
            {/* This component will be rendered before the css so we specify the font family inline here.*/}
            <p style={{ fontFamily: "sans-serif" }}>Loading</p>
        </Center>
    )
}
