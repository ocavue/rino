import React from "react"

export const Layout: React.FC = props => {
    console.log("loading layout")
    return (
        <div>
            <span>layout </span>
            {props.children}
        </div>
    )
}

export const useMyHook = () => {
    const [num, setNum] = React.useState(0)
    const plusOne = () => setNum(n => n + 1)
    return { num, plusOne }
}
