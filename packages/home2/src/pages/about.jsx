import React from "react"

import { about } from "../about"
import { addAndMultiply } from "../add"
import { multiplyAndAdd } from "../multiply"
import { share2 } from "../share2"

const onClick = () => {
    console.log(about())
    console.log(share2())
}

export default function About() {
    return (
        <>
            <button onClick={onClick}>click me</button>
            <h1>About</h1>
            <div>{addAndMultiply(1, 2, 3)}</div>
            <div>{multiplyAndAdd(1, 2, 3)}</div>
        </>
    )
}
