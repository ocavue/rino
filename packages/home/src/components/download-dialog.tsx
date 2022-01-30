import { Close as CloseIcon, Download as DownloadIcon } from "@mui/icons-material"
import { Button, ButtonGroup, Dialog, DialogContent, DialogTitle, Hidden, IconButton, SvgIcon, Typography } from "@mui/material"
import { Box } from "@mui/system"
import React from "react"

import { colors } from "../styles/color"
import { getDownloadLink } from "./links"
import { AppleSvg, LinuxSvg, MicrosoftSvg } from "./svgs"

const VERSION = process.env.NEXT_PUBLIC_RINO_VERSION

const platforms = [
    [
        {
            name: "Mac",
            arch: "(Universal)",
            link: getDownloadLink("mac", VERSION),
            icon: <AppleSvg />,
        },
    ],
    [
        {
            name: "Windows",
            arch: "(64-bit)",
            link: getDownloadLink("win-64", VERSION),
            icon: <MicrosoftSvg />,
        },
        {
            name: "Windows",
            arch: "(32-bit)",
            link: getDownloadLink("win-32", VERSION),
            icon: <MicrosoftSvg />,
        },
        {
            name: "Windows",
            arch: "(ARM)",
            link: getDownloadLink("win-arm", VERSION),
            icon: <MicrosoftSvg />,
        },
    ],
    [
        {
            name: "Linux",
            arch: "(64-bit)",
            link: getDownloadLink("linux-64", VERSION),
            icon: <LinuxSvg />,
        },
        {
            name: "Linux",
            arch: "(ARM)",
            link: getDownloadLink("linux-arm", VERSION),
            icon: <LinuxSvg />,
        },
    ],
]

export const DownloadDialog: React.FC<{ open: boolean; handleClose: () => void }> = ({ open, handleClose }) => {
    return (
        <Dialog
            fullWidth
            maxWidth="xs"
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
                    flexDirection: "column",
                }}
                dividers
            >
                {platforms.map((platformGroup, index) => (
                    <ButtonGroup
                        key={index}
                        orientation="vertical"
                        aria-label="vertical outlined button group"
                        sx={{
                            mt: "8px",
                            mb: "8px",
                            ml: "0px",
                            mr: "0px",
                        }}
                    >
                        {platformGroup.map((platform) => (
                            <Button
                                key={platform.name}
                                href={platform.link}
                                rel="noopener noreferrer"
                                target="_blank"
                                sx={{
                                    color: colors.gray900,
                                }}
                                size="large"
                                variant="outlined"
                                startIcon={
                                    <SvgIcon
                                        sx={{
                                            width: "24px",
                                            height: "24px",
                                            mr: "8px",
                                            color: colors.gray800,
                                        }}
                                    >
                                        {platform.icon}
                                    </SvgIcon>
                                }
                                endIcon={
                                    <DownloadIcon
                                        sx={{
                                            width: "24px",
                                            height: "24px",
                                            mr: "4px",
                                            color: colors.gray600,
                                        }}
                                    >
                                        {platform.icon}
                                    </DownloadIcon>
                                }
                            >
                                <Typography noWrap>{platform.name}</Typography>
                                <Box width={8}></Box>
                                <Typography noWrap>{platform.arch}</Typography>
                                <Box flex={1}></Box>
                            </Button>
                        ))}
                    </ButtonGroup>
                ))}
            </DialogContent>
        </Dialog>
    )
}
