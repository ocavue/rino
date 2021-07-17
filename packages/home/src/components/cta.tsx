import { createStyles, makeStyles } from "@material-ui/core"
import ButtonBase from "@material-ui/core/ButtonBase"
import Typography from "@material-ui/core/Typography"
import React from "react"

const useStyles = makeStyles((theme) =>
    createStyles({
        cta: {
            width: "100%",

            marginTop: 120,
            marginBottom: 160,
            paddingTop: 48,
            paddingBottom: 48,

            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            background: theme.palette.primary.light,
        },
        header: {
            marginTop: 0,
            marginBottom: 32,
            fontWeight: 700,
            color: theme.palette.common.white,

            fontSize: "2.2rem",
            [theme.breakpoints.up("sm")]: {
                fontSize: "3rem",
            },
        },

        button: {
            position: "relative",
            height: 64,
            width: 240,

            border: "2px solid #fff",
            color: "#fff",

            "&:hover, &$focusVisible": {
                border: "none",
                zIndex: 1,
                backgroundColor: "#fff",
                color: "#000",
            },
        },
        focusVisible: {},

        buttonText: {
            fontSize: "1.7em",
            fontWeight: 600,
            position: "relative",
            padding: `${theme.spacing(2)}px ${theme.spacing(4)}px ${theme.spacing(1) + 6}px`,
        },
    }),
)

// call-to-action
export const CTA: React.FC<{ handleOpenDownloadDialog: () => void }> = ({ handleOpenDownloadDialog }) => {
    const classes = useStyles()

    return (
        <div className={classes.cta}>
            <h3 className={classes.header}>Download Rino today</h3>
            <ButtonBase
                focusRipple
                className={classes.button}
                focusVisibleClassName={classes.focusVisible}
                onClick={handleOpenDownloadDialog}
            >
                <Typography component="span" variant="subtitle1" color="inherit" className={classes.buttonText}>
                    Download Rino
                </Typography>
            </ButtonBase>
        </div>
    )
}
