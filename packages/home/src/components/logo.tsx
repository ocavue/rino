import React from "react"

type HTMLImageProps = React.ComponentProps<"img">
type LogoProps = Pick<HTMLImageProps, "className" | "style">

export const Logo: React.FC<LogoProps> = (props) => {
    return <img src="/share/img/icons/safari-pinned-tab.svg" alt="Rino Logo" {...props} />
}
