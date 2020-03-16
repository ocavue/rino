import React from "react"

import * as svg from "./TableMenuSvg"
import { ActionMethod } from "@remirror/core"
import { IconButton, Paper, Snackbar, Theme, createStyles, makeStyles } from "@material-ui/core"
import { StoreContainer } from "src/store"
import { WysiwygExtensions } from "./wysiwyg-extension"
import { maxDrawerWidth } from "src/constants"
import { useRemirrorContext } from "@remirror/react"
import clsx from "clsx"

const useStyles = makeStyles((theme: Theme) => {
    return createStyles({
        snackbar: {
            zIndex: theme.zIndex.snackbar + 1,
            transition: theme.transitions.create(["left"], {
                easing: theme.transitions.easing.easeOut,
                duration: theme.transitions.duration.enteringScreen,
            }),
        },
        snackbarShift: {
            [theme.breakpoints.up("md")]: {
                left: `calc(50% + ${maxDrawerWidth / 2}px)`,
            },
        },
        menuPaper: {
            zIndex: theme.zIndex.snackbar + 1,
            padding: "4px",
        },
        menuButton: {
            padding: "12px",
            height: "48px",
            width: "48px",
        },
    })
})

export const TableMenu: React.FC = () => {
    const { actions, helpers } = useRemirrorContext<WysiwygExtensions>()
    const showTableMenu = !!helpers.selectedTableCell()

    const {
        state: { drawerActivity },
    } = StoreContainer.useContainer()

    const classes = useStyles()
    const options: [string, string, ActionMethod][] = [
        ["add-row-before", svg.addRowBefore, actions.tableAddRowBefore],
        ["add-row-after", svg.addRowAfter, actions.tableAddRowAfter],
        ["add-column-before", svg.addColumnBefore, actions.tableAddColumnBefore],
        ["add-column-after", svg.addColumnAfter, actions.tableAddColumnAfter],
        ["delete-row", svg.deleteRow, actions.tableDeleteRow],
        ["delete-column", svg.deleteColumn, actions.tableDeleteColumn],
    ]

    const buttons = options.map(([id, svg, action]) => {
        return (
            <IconButton
                key={id}
                id={id}
                data-testid={id}
                onClick={action}
                className={classes.menuButton}
            >
                <img src={svg} />
            </IconButton>
        )
    })

    return (
        <Snackbar
            open={showTableMenu}
            onClose={() => {}}
            classes={{
                root: clsx(classes.snackbar, {
                    [classes.snackbarShift]: drawerActivity,
                }),
            }}
        >
            <Paper variant="outlined" className={classes.menuPaper}>
                <>{buttons}</>
            </Paper>
        </Snackbar>
    )
}
