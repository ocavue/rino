import React from "react"

import Center from "./Center"

function Loading() {
    return (
        <Center>
            {/* This component will be rendered before the css so we specify the font family inline here.*/}
            <p
                style={{
                    fontFamily: "SFMono-Regular,Consolas,Liberation Mono,Menlo,monospace",
                    fontSize: "18px",
                }}
            >
                Loading
            </p>
        </Center>
    )
}

export default Loading
