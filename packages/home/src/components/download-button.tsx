import ButtonBase from "@material-ui/core/ButtonBase"
import { createStyles, makeStyles } from "@material-ui/core/styles"
import Typography from "@material-ui/core/Typography"
import React from "react"

const useStyles = makeStyles((theme) =>
    createStyles({
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

        text: {
            fontSize: "1.7em",
            fontWeight: 600,
            position: "relative",
            padding: `${theme.spacing(2)}px ${theme.spacing(4)}px ${theme.spacing(1) + 6}px`,
        },
    }),
)

export const DownloadButton: React.FC = () => {
    const classes = useStyles()

    return (
        <ButtonBase focusRipple className={classes.button} focusVisibleClassName={classes.focusVisible}>
            <Typography component="span" variant="subtitle1" color="inherit" className={classes.text}>
                Download Rino
            </Typography>
        </ButtonBase>
    )
}
