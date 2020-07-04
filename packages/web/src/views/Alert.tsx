import { Box, createStyles, Divider, makeStyles, Theme } from "@material-ui/core"
import React from "react"

import Center from "src/views/Center"

const useStyles = makeStyles((theme: Theme) => {
    return createStyles({
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
            fontSize: "1.2em",
        },
    })
})

const Alert: React.FC<{ title: string; message: string }> = ({ title, message, children }) => {
    const classes = useStyles()
    return (
        <Center data-testid={`alert-${title}`}>
            <Box display="flex" alignItems="center">
                <h1 className={classes.title}>{title}</h1>
                <Divider orientation="vertical" light={true} classes={{ root: classes.divider }} />
                <div className={classes.message}>{message}</div>
            </Box>
            <Box height="32px" />
            {children}
        </Center>
    )
}

export default Alert
