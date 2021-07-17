import { Button, Dialog, DialogContent, DialogTitle, IconButton, SvgIcon, Typography } from "@material-ui/core"
import { createStyles, makeStyles } from "@material-ui/core/styles"
import CloseIcon from "@material-ui/icons/Close"
import React from "react"

import { getDownloadLinks } from "./links"
import { AppleSvg, LinuxSvg, MicrosoftSvg } from "./svgs"

const useStyles = makeStyles((theme) =>
    createStyles({
        header: {
            paddingTop: 24,
            paddingBottom: 24,
            paddingLeft: 40,
            paddingRight: 40,

            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            background: "#fff",
        },
        content: {
            paddingTop: 36,
            paddingBottom: 36,
            paddingLeft: 40,
            paddingRight: 40,
            background: theme.palette.background.default,

            display: "flex",
            justifyContent: "space-between",
        },
        contentButton: {
            paddingTop: 12,
            paddingBottom: 12,
            paddingLeft: 26,
            paddingRight: 26,

            "& + &": {
                marginLeft: 28,
            },
        },
        contentButtonContent: {
            display: "flex",
            flexDirection: "column",
        },
        icon: {
            width: 26,
            height: 26,
            marginRight: 4,
        },
    }),
)

export const DownloadDialog: React.FC<{ open: boolean; handleClose: () => void }> = ({ open, handleClose }) => {
    const classes = useStyles()

    const links = getDownloadLinks("0.31.2")
    const platforms = [
        {
            name: "Mac",
            link: links.mac,
            icon: <AppleSvg />,
        },
        {
            name: "Windows",
            link: links.win,
            icon: <MicrosoftSvg />,
        },
        {
            name: "Linux",
            link: links.linux,
            icon: <LinuxSvg />,
        },
    ]

    return (
        <Dialog open={open} onClose={handleClose} aria-labelledby="download-dialog-title" aria-describedby="download-dialog-description">
            <DialogTitle disableTypography id="download-dialog-title" className={classes.header}>
                <Typography component="h2" variant="h5">
                    Download Rino
                </Typography>
                <IconButton aria-label="delete" onClick={handleClose}>
                    <CloseIcon />
                </IconButton>
            </DialogTitle>
            <DialogContent className={classes.content} dividers>
                {platforms.map((platform) => (
                    <Button
                        key={platform.name}
                        href={platform.link}
                        rel="noopener noreferrer"
                        target="_blank"
                        className={classes.contentButton}
                        size="large"
                        variant="outlined"
                        startIcon={<SvgIcon className={classes.icon}>{platform.icon}</SvgIcon>}
                    >
                        <div className={classes.contentButtonContent}>
                            <Typography variant="h6">{platform.name}</Typography>
                        </div>
                    </Button>
                ))}
            </DialogContent>
        </Dialog>
    )
}
