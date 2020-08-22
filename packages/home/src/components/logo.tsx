import React from "react"

import logo from "../../../web/public/img/icons/safari-pinned-tab.svg"

export const Logo: React.FC<{ className?: string }> = (props) => (
    <img {...props} src={logo} alt="Rino" width="1024" height="1024" />
)
