import React from "react"

import { addAndMultiply } from "../add"
import { home } from "../home"
import { multiplyAndAdd } from "../multiply"
import { share } from "../share"

const onClick = () => {
    console.log(home())
    console.log(share())
}

export default function Home() {
    return (
        <>
            <h1>Home v7</h1>
            <button onClick={onClick}>click me</button>
            <div>{addAndMultiply(1, 2, 3)}</div>
            <div>{multiplyAndAdd(1, 2, 3)}</div>
        </>
    )
}
