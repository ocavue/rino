import { Box, createStyles, makeStyles, Theme } from "@material-ui/core"
import React from "react"

import Center from "src/views/Center"

const useStyles = makeStyles((theme: Theme) => {
    return createStyles({
        divider: {
            border: "none",
            width: "2px",
            height: "56px",
            marginLeft: "16px",
            marginRight: "16px",
            backgroundColor: theme.palette.text.primary,
        },
        title: {
            margin: 0,
            padding: 0,
            fontWeight: "normal",
        },
        message: {
            fontSize: "1.2em",
        },
    })
})

const Alert: React.FC<{ title: string; message: string }> = ({ title, message, children }) => {
    const classes = useStyles()
    return (
        <Center data-testid={`alert_${title}`}>
            <Box display="flex" alignItems="center">
                <h1 className={classes.title}>{title}</h1>
                <hr className={classes.divider} />
                <div className={classes.message}>{message}</div>
            </Box>
            <Box height="32px" />
            {children}
        </Center>
    )
}

export default Alert
