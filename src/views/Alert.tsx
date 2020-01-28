import * as m from "@material-ui/core"
import React from "react"

const useStyles = m.makeStyles((theme: m.Theme) => {
    return m.createStyles({
        center: {
            display: "flex",
            alignItems: "center",
            position: "fixed",
            left: "50%",
            top: "50%",
            transform: "translateX(-50%) translateY(-50%)",
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
    })
})

const Alert: React.FC<{ title: string; message: string }> = ({ title, message }) => {
    const classes = useStyles()
    return (
        <div className={classes.center} data-testid={`alert-${title}`}>
            <h1 className={classes.title}>{title}</h1>
            <m.Divider orientation="vertical" light={true} classes={{ root: classes.divider }} />
            <div className={classes.message}>{message}</div>
        </div>
    )
}

export default Alert
