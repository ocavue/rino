import { Close as CloseIcon } from "@mui/icons-material"
import { Button, Dialog, DialogContent, DialogTitle, Hidden, IconButton, SvgIcon, Typography } from "@mui/material"
import createStyles from "@mui/styles/createStyles"
import makeStyles from "@mui/styles/makeStyles"
import React, { useMemo } from "react"

import { getDownloadLink } from "./links"
import { AppleSvg, LinuxSvg, MicrosoftSvg } from "./svgs"

const VERSION = process.env.NEXT_PUBLIC_RINO_VERSION

export const DownloadDialog: React.FC<{ open: boolean; handleClose: () => void }> = ({ open, handleClose }) => {
    const platforms = useMemo(() => {
        return [
            {
                name: "Mac",
                link: getDownloadLink("mac", VERSION),
                icon: <AppleSvg />,
            },
            {
                name: "Windows",
                link: getDownloadLink("win", VERSION),
                icon: <MicrosoftSvg />,
            },
            {
                name: "Linux",
                link: getDownloadLink("linux", VERSION),
                icon: <LinuxSvg />,
            },
        ]
    }, [])

    return (
        <Dialog
            fullWidth
            maxWidth="sm"
            open={open}
            onClose={handleClose}
            aria-labelledby="download-dialog-title"
            aria-describedby="download-dialog-description"
        >
            <DialogTitle
                id="download-dialog-title"
                sx={{
                    paddingTop: 24,
                    paddingBottom: 24,
                    paddingLeft: 40,
                    paddingRight: 40,

                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    background: "#fff",
                }}
            >
                <Typography component="h2" variant="h5">
                    Download Rino
                </Typography>
                <Hidden smDown>
                    <Typography style={{ marginLeft: 16 }} variant="subtitle2">
                        v{VERSION}
                    </Typography>
                </Hidden>
                <div style={{ flex: 1 }} />
                <IconButton aria-label="delete" onClick={handleClose} size="large">
                    <CloseIcon />
                </IconButton>
            </DialogTitle>
            <DialogContent
                sx={{
                    paddingTop: 36,
                    paddingBottom: 36,
                    paddingLeft: 40,
                    paddingRight: 40,
                    background: (theme) => theme.palette.grey[50],

                    display: "flex",
                    justifyContent: "center",
                    flexDirection: { xs: "column", sm: "row" },
                }}
                dividers
            >
                {platforms.map((platform) => (
                    <Button
                        key={platform.name}
                        href={platform.link}
                        rel="noopener noreferrer"
                        target="_blank"
                        sx={{
                            paddingTop: 12,
                            paddingBottom: 12,
                            paddingLeft: 26,
                            paddingRight: 26,
                            // minWidth: "900px",

                            marginTop: 8,
                            marginBottom: 8,
                            marginLeft: 12,
                            marginRight: 12,
                        }}
                        size="large"
                        variant="outlined"
                        startIcon={
                            <SvgIcon
                                sx={{
                                    width: 26,
                                    height: 26,
                                    marginRight: 4,
                                }}
                            >
                                {platform.icon}
                            </SvgIcon>
                        }
                    >
                        <Typography variant="h6" noWrap>
                            {platform.name}
                        </Typography>
                    </Button>
                ))}
            </DialogContent>
        </Dialog>
    )
}
