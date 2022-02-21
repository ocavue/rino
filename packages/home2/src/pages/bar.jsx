import React from "react"

import { env } from "../env"
import { share } from "../share"

const onClick = () => {
    console.log(env())
    console.log(share())
}

export default function Bar() {
    return (
        <>
            <h1>{"bar ".repeat(10)}</h1>
            <button onClick={onClick}>click me</button>
            <p>{"bar ".repeat(1000)}</p>
        </>
    )
}
