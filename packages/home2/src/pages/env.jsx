import React from "react"

import { env } from "../env"
import { share } from "../share"

const onClick = () => {
    console.log(env())
    console.log(share())
}

export default function Env() {
    let msg = "default message here"
    try {
        msg = process.env.MY_CUSTOM_SECRET || msg
    } catch {
        // do nothing
    }

    return (
        <h1>
            {msg}

            <button onClick={onClick}>click me</button>
        </h1>
    )
}
