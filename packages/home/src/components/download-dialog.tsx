import { Close as CloseIcon } from "@mui/icons-material"
import { Button, Dialog, DialogContent, DialogTitle, Hidden, IconButton, SvgIcon, Typography } from "@mui/material"
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
                    paddingTop: "24px",
                    paddingBottom: "24px",
                    paddingLeft: "40px",
                    paddingRight: "40px",

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
                    pt: 4,
                    pb: 4,
                    pl: 5,
                    pr: 5,
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
                            pt: "12px",
                            pb: "12px",
                            pl: "26px",
                            pr: "26px",
                            // minWidth: "900px",

                            mt: "8px",
                            mb: "8px",
                            ml: "12px",
                            mr: "12px",
                        }}
                        size="large"
                        variant="outlined"
                        startIcon={
                            <SvgIcon
                                sx={{
                                    width: "26px",
                                    height: "26px",
                                    mr: "4px",
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
