import * as m from "@material-ui/core"
import React from "react"

const useStyles = m.makeStyles((theme: m.Theme) => {
    return m.createStyles({
        center: {
            position: "fixed",
            left: "50%",
            top: "50%",
            transform: "translateX(-50%) translateY(-50%)",

            display: "flex",
            alignItems: "center",
            flexDirection: "column",
        },
        divider: {
            height: "56px",
            marginLeft: "24px",
            marginRight: "24px",
            backgroundColor: theme.palette.text.primary,
        },
        title: {
            margin: 0,
            padding: 0,
            fontWeight: "normal",
        },
        message: {
            fontSize: "1.0em",
        },
        nav: {
            textTransform: "none",
        },
    })
})

const Alert: React.FC<{ title: string; message: string }> = ({ title, message, children }) => {
    const classes = useStyles()
    return (
        <div className={classes.center} data-testid={`alert-${title}`}>
            <m.Box display="flex" alignItems="center">
                <h1 className={classes.title}>{title}</h1>
                <m.Divider
                    orientation="vertical"
                    light={true}
                    classes={{ root: classes.divider }}
                />
                <div className={classes.message}>{message}</div>
            </m.Box>
            <m.Box height="24px" />
            <m.Button href="/" fullWidth={true} className={classes.nav}>
                Return homepage
            </m.Button>
        </div>
    )
}

export default Alert
