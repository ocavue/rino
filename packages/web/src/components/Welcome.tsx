/* Copyright (c) 2020-present ocavue@gmail.com */

import * as m from "@material-ui/core"
import React from "react"

const useStyles = m.makeStyles((theme: m.Theme) => {
    return m.createStyles({
        text: {
            color: theme.palette.text.secondary,
        },
        topSpacing: {
            flex: 5,
        },
        buttonSpacing: {
            flex: 7,
        },
    })
})

function Welcome() {
    const classes = useStyles()
    return (
        <>
            <div className={classes.topSpacing} />
            <h2 className={classes.text}>Welcome to Rino</h2>
            <div className={classes.buttonSpacing} />
        </>
    )
}

export default Welcome
