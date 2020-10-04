import { createStyles, IconButton, makeStyles, Paper, Snackbar, Theme } from "@material-ui/core"
import { CommandsFromCombined, CommandShape, HelpersFromCombined } from "@remirror/core"
import { MAX_DRAWER_WIDTH } from "@rino.app/common/src/constants"
import clsx from "clsx"
import React, { useMemo } from "react"

import { WorksapceStateContainer } from "src/controller/workspace-state/hook"

import * as svg from "./TableMenuSvg"
import { WysiwygCombined } from "./wysiwyg-manager"

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
                left: `calc(50% + ${MAX_DRAWER_WIDTH / 2}px)`,
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

export const TableMenu: React.FC<{
    commands: CommandsFromCombined<WysiwygCombined>
    helpers: HelpersFromCombined<WysiwygCombined>
}> = ({ commands, helpers }) => {
    const showTableMenu = !!helpers.selectedTableCell()

    const { drawerActivity } = WorksapceStateContainer.useContainer()

    const classes = useStyles()

    const buttons = useMemo(() => {
        const options: [string, React.FC, CommandShape][] = [
            ["add-row-before", svg.AddRowBefore, commands.addTableRowBefore],
            ["add-row-after", svg.AddRowAfter, commands.addTableRowAfter],
            ["add-column-before", svg.AddColumnBefore, commands.addTableColumnBefore],
            ["add-column-after", svg.AddColumnAfter, commands.addTableColumnAfter],
            ["delete-row", svg.DeleteRow, commands.deleteTableRow],
            ["delete-column", svg.DeleteColumn, commands.deleteTableColumn],
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
    }, [commands, classes])

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
