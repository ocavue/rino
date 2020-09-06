import React from "react"

import Svg from "../assets/share/img/icons/safari-pinned-tab.svg"

export const Logo: React.FC<{ className?: string }> = (props) => (
    <div {...props}>
        <Svg alt="Rino" width="128" height="128" />
    </div>
)
