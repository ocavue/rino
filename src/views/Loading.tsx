import React from "react"

import Center from "./Center"

export function Loading() {
    return (
        <Center>
            {/* This component will be rendered before the css so we specify the font family inline here.*/}
            <p style={{ fontFamily: "sans-serif" }}>Loading</p>
        </Center>
    )
}
