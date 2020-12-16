import { createStyles, IconButton, makeStyles, Paper, Snackbar, Theme } from "@material-ui/core"
import { CommandsFromCombined, CommandShape, HelpersFromCombined } from "@remirror/core"
import clsx from "clsx"
import React, { useMemo } from "react"

import { TableMenuSvgs } from "../table-menu/svg"
import { DrawerActivityContainer } from "../types"
import { WysiwygCombined } from "./wysiwyg-extension"

type StylesProps = { maxDrawerWidth: number }

const useStyles = makeStyles<Theme, StylesProps>((theme: Theme) => {
    return createStyles((props: StylesProps) => ({
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
                left: `calc(50% + ${props.maxDrawerWidth / 2}px)`,
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
    }))
})

export type TableMenuProps = {
    commands: CommandsFromCombined<WysiwygCombined>
    helpers: HelpersFromCombined<WysiwygCombined>
    svgs: TableMenuSvgs
    maxDrawerWidth: number
    drawerActivityContainer: DrawerActivityContainer
}

export const TableMenu: React.FC<TableMenuProps> = ({ commands, helpers, svgs, maxDrawerWidth, drawerActivityContainer }) => {
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
    }, [commands, classes, svgs])

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
