import {
    Box,
    Dialog,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Typography,
} from "@material-ui/core"
import React from "react"

import logo from "src/assets/logo.png"
import { version } from "src/controller/config"

export const AboutDialog: React.FC<{
    open: boolean
    setOpen: (open: boolean) => void
}> = ({ open, setOpen }) => {
    const onClose = () => setOpen(false)
    return (
        <Dialog open={open} onClose={onClose} data-testid="about-dialog">
            <Box height="24px" />
            <DialogTitle>
                <Typography align="center">
                    <img src={logo} width="128px" height="128px" />
                </Typography>
                <Typography align="center">Rino</Typography>
            </DialogTitle>
            <DialogContent>
                <DialogContentText align="center">
                    <span data-testid="about-dialog-version">Version {version}</span>
                    <br />
                    <span data-testid="about-dialog-copyright">
                        Copyright © 2020 Ocavue. All rights reserved.
                    </span>
                </DialogContentText>
            </DialogContent>
        </Dialog>
    )
}
