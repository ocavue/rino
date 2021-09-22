import { IconButton, Paper, Snackbar } from "@mui/material"
import { CommandsFromExtensions, CommandShape } from "@remirror/core"
import { useRemirrorContext } from "@remirror/react-core"
import React, { useMemo } from "react"

import { selectedTableCell } from "../../extensions/table/table-helper"
import { tableMenuSvgs as svgs } from "../table-menu/svg"
import { DrawerActivityContainer } from "../types"
import { WysiwygExtension } from "./wysiwyg-extension"

export type TableMenuProps = {
    commands: CommandsFromExtensions<WysiwygExtension>
    maxDrawerWidth: number
    drawerActivityContainer: DrawerActivityContainer
}

const TableMenu: React.FC<TableMenuProps> = ({ commands, maxDrawerWidth, drawerActivityContainer }) => {
    const { view } = useRemirrorContext()
    const showTableMenu = !!selectedTableCell(view.state)

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
                <IconButton
                    key={id}
                    id={id}
                    data-testid={id}
                    onClick={action}
                    sx={{
                        padding: "12px",
                        height: "48px",
                        width: "48px",
                        "& svg": {
                            // Change the svg color based on the theme
                            fill: (theme) => theme.palette.text.secondary,
                        },
                    }}
                >
                    <SvgComponent />
                </IconButton>
            )
        })
    }, [commands])

    return (
        <Snackbar
            open={showTableMenu}
            onClose={() => {}}
            sx={{
                zIndex: (theme) => theme.zIndex.snackbar + 1,
                transition: (theme) =>
                    theme.transitions.create(["left"], {
                        easing: theme.transitions.easing.easeOut,
                        duration: theme.transitions.duration.enteringScreen,
                    }),
                marginBottom: "env(safe-area-inset-bottom)",
            }}
        >
            <Paper
                variant="outlined"
                sx={{
                    zIndex: (theme) => theme.zIndex.snackbar + 1,
                    padding: "4px",
                }}
            >
                <>{buttons}</>
            </Paper>
        </Snackbar>
    )
}

export default TableMenu
