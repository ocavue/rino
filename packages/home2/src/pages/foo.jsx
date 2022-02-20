import React from "react"

import { env } from "../env"
import { share } from "../share"

const onClick = () => {
    console.log(env())
    console.log(share())
}

export default function Foo() {
    return (
        <>
            <title>Foo</title>
            <h1>{"foo ".repeat(10)}</h1>
            <button onClick={onClick}>click me</button>
            <p>{"foo ".repeat(1000)}</p>
        </>
    )
}
