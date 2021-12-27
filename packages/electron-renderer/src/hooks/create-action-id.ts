export const createActionId: () => number = (() => {
    let id = 1
    return () => id++
})()
