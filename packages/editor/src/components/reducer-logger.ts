import { Reducer } from "react"

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
        console.group(
            `%cAction: %c${(action as any).type} %cat ${getCurrentTimeFormatted()}`,
            "color: lightgreen; font-weight: bold;",
            "color: black; font-weight: bold;",
            "color: lightblue; font-weight: lighter;",
        )
        console.log("%cPrevious State:", "color: #9E9E9E; font-weight: 700;", state)
        console.log("%cAction:", "color: #00A7F7; font-weight: 700;", action)
        console.log("%cNext State:", "color: #47B04B; font-weight: 700;", next)
        console.groupEnd()
        return next
    }

    return reducerWithLogger
}
