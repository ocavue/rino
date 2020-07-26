import { createStyles, makeStyles } from "@material-ui/styles"
import React from "react"

import { colors } from "../styles/color"

const useStyles = makeStyles(
    createStyles({
        appbar: {
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",

            borderBottomWidth: "2px",
            borderBottomColor: colors.gray100,
            borderBottomStyle: "solid",

            paddingTop: "1.5rem",
            paddingBottom: "1.5rem",
        },
    }),
)

export const Appbar: React.FC = ({ children }) => {
    const classes = useStyles()

    return <div className={classes.appbar}>{children}</div>
}
