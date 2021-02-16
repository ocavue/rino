import { createStyles, IconButton, makeStyles, Paper, Snackbar, Theme } from "@material-ui/core"
import { CommandsFromExtensions, CommandShape, GetHelpers } from "@remirror/core"
import clsx from "clsx"
import React, { useMemo } from "react"

import { tableMenuSvgs as svgs } from "../table-menu/svg"
import { DrawerActivityContainer } from "../types"
import { WysiwygExtension } from "./wysiwyg-extension"

type StylesProps = { maxDrawerWidth: number }

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
                left: (props: StylesProps) => `calc(50% + ${props.maxDrawerWidth / 2}px)`,
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

export type TableMenuProps = {
    commands: CommandsFromExtensions<WysiwygExtension>
    helpers: GetHelpers<WysiwygExtension>
    maxDrawerWidth: number
    drawerActivityContainer: DrawerActivityContainer
}

const TableMenu: React.FC<TableMenuProps> = ({ commands, helpers, maxDrawerWidth, drawerActivityContainer }) => {
    const showTableMenu = !!helpers.selectedTableCell()

    const { drawerActivity } = drawerActivityContainer.useContainer()

    const classes = useStyles({ maxDrawerWidth })

    const buttons = useMemo(() => {
        const options: [string, React.FC, CommandShape][] = [
            ["add-row-before", svgs.AddRowBefore, commands.addTableRowBefore],
            ["add-row-after", svgs.AddRowAfter, commands.addTableRowAfter],
            ["add-column-before", svgs.AddColumnBefore, commands.addTableColumnBefore],
            ["add-column-after", svgs.AddColumnAfter, commands.addTableColumnAfter],
            ["delete-row", svgs.DeleteRow, commands.deleteTableRow],
            ["delete-column", svgs.DeleteColumn, commands.deleteTableColumn],
        ]
        return options.map(([id, SvgComponent, action]) => {
            return (
                <IconButton key={id} id={id} data-testid={id} onClick={action} className={classes.menuButton}>
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

export default TableMenu
