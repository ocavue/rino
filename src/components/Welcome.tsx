import * as m from "@material-ui/core"
import React from "react"

const useStyles = m.makeStyles((theme: m.Theme) => {
    return m.createStyles({
        wrapper: {
            height: "100%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
        },
        text: {
            color: theme.palette.text.secondary,
        },
    })
})

export function Welcome() {
    const classes = useStyles()
    return (
        <div className={classes.wrapper}>
            <h2 className={classes.text}>Welcome to Rino</h2>
        </div>
    )
}
