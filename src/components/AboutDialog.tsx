import * as m from "@material-ui/core"
import { version } from "src/controller/config"
import React from "react"
import logo from "src/assets/logo.png"

export const AboutDialog: React.FC<{
    open: boolean
    setOpen: (open: boolean) => void
}> = ({ open, setOpen }) => {
    const onClose = () => setOpen(false)
    return (
        <m.Dialog open={open} onClose={onClose} data-testid="about-dialog">
            <m.DialogTitle>
                <m.Typography align="center">
                    <img src={logo} width="128px" height="128px" />
                </m.Typography>
                <m.Typography align="center">Rino</m.Typography>
            </m.DialogTitle>
            <m.DialogContent>
                <m.DialogContentText align="center">
                    <span data-testid="about-dialog-version">Version {version}</span>
                    <br />
                    <span data-testid="about-dialog-copyright">
                        Copyright © 2020 Ocavue. All rights reserved.
                    </span>
                </m.DialogContentText>
            </m.DialogContent>
        </m.Dialog>
    )
}
