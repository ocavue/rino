import { createStyles, IconButton, makeStyles, Paper, Snackbar, Theme } from "@material-ui/core"
import { ActionMethod } from "@remirror/core"
import { useRemirrorContext } from "@remirror/react"
import clsx from "clsx"
import React, { useMemo } from "react"

import { maxDrawerWidth } from "src/constants"
import { StoreContainer } from "src/store"

import * as svg from "./TableMenuSvg"
import { WysiwygExtensions } from "./wysiwyg-extension"

const useStyles = makeStyles((theme: Theme) => {
    return createStyles({
        snackbar: {
            zIndex: theme.zIndex.snackbar + 1,
            transition: theme.transitions.create(["left"], {
                easing: theme.transitions.easing.easeOut,
                duration: theme.transitions.duration.enteringScreen,
            }),
            marginBottom: "env(safe-area-inset-bottom)",
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
            "& svg": {
                // Change the svg color based on the theme
                fill: theme.palette.text.secondary,
            },
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

    const buttons = useMemo(() => {
        const options: [string, React.FC, ActionMethod][] = [
            ["add-row-before", svg.AddRowBefore, actions.tableAddRowBefore],
            ["add-row-after", svg.AddRowAfter, actions.tableAddRowAfter],
            ["add-column-before", svg.AddColumnBefore, actions.tableAddColumnBefore],
            ["add-column-after", svg.AddColumnAfter, actions.tableAddColumnAfter],
            ["delete-row", svg.DeleteRow, actions.tableDeleteRow],
            ["delete-column", svg.DeleteColumn, actions.tableDeleteColumn],
        ]
        return options.map(([id, SvgComponent, action]) => {
            return (
                <IconButton
                    key={id}
                    id={id}
                    data-testid={id}
                    onClick={action}
                    className={classes.menuButton}
                >
                    <SvgComponent />
                </IconButton>
            )
        })
    }, [actions, classes.menuButton])

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
