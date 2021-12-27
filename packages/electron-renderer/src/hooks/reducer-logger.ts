/* eslint-disable no-console */

import { Reducer } from "react"

import { logger } from "../logger"

const getCurrentTimeFormatted = () => {
    const currentTime = new Date()
    const hours = currentTime.getHours()
    const minutes = currentTime.getMinutes()
    const seconds = currentTime.getSeconds()
    const milliseconds = currentTime.getMilliseconds()
    return `${hours}:${minutes}:${seconds}.${milliseconds}`
}

export function withLogReducer<S, A>(reducer: Reducer<S, A>): Reducer<S, A> {
    const reducerWithLogger = (state: S, action: A) => {
        const next = reducer(state, action)
        logger.info(
            `%cAction: %c${(action as any).type} %cat ${getCurrentTimeFormatted()}`,
            "color: lightgreen; font-weight: bold;",
            "color: black; font-weight: bold;",
            "color: lightblue; font-weight: lighter;",
        )
        logger.log("%cPrevious State:", "color: #9E9E9E; font-weight: 700;", JSON.stringify(state))
        logger.log("%cAction:", "color: #00A7F7; font-weight: 700;", action)
        logger.log("%cNext State:", "color: #47B04B; font-weight: 700;", JSON.stringify(next))
        // logger.groupEnd()
        return next
    }

    return reducerWithLogger
}
