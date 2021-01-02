import * as m from "@material-ui/core"
import clsx from "clsx"
import React from "react"

import { MAX_DRAWER_WIDTH } from "src/constants"
import { WorksapceStateContainer } from "src/controller/workspace-state/hook"
import { useIsMobile } from "src/hooks"

import ActivityBody from "./ActivityBody"
import ActivityHeader from "./ActivityHeader"
import NoteBody from "./NoteBody"
import NoteHeader from "./NoteHeader"

const useStyles = m.makeStyles((theme: m.Theme) => {
    return m.createStyles({
        drawer: {
            display: "flex",
            alignItems: "stretch",
            height: "100%",
            willChange: "transform",
        },
        drawerColumn: {
            display: "flex",
            flexDirection: "column",
            overflowX: "hidden",
            overflowY: "hidden",
        },
        drawerColumnNote: {
            flex: 3,
        },
        drawerColumnActivity: {
            flex: 2,
        },
        drawerPaper: {
            maxWidth: MAX_DRAWER_WIDTH,
            width: `calc(100vw - 48px)`,
        },
    })
})

const Drawer: React.FC = () => {
    const { drawerActivity, setDrawerActivity } = WorksapceStateContainer.useContainer()

    const isMobile = useIsMobile()
    const classes = useStyles()

    // Automatically close the drawer when the window is small
    React.useEffect(() => {
        if (isMobile) {
            setDrawerActivity(false)
        }
    }, [isMobile, setDrawerActivity])

    const drawer = (
        <div className={classes.drawer} data-testid="sidebar">
            <div className={clsx(classes.drawerColumn, classes.drawerColumnActivity)}>
                <ActivityHeader />
                <m.Divider />
                <ActivityBody />
            </div>
            <m.Divider orientation="vertical" />
            <div className={clsx(classes.drawerColumn, classes.drawerColumnNote)}>
                <NoteHeader />
                <m.Divider />
                <NoteBody />
            </div>
        </div>
    )

    return (
        <nav className={clsx({ "drawer--open": drawerActivity }, { "drawer--close": !drawerActivity })}>
            <m.Hidden mdUp implementation="js">
                <m.Drawer
                    variant="temporary"
                    open={drawerActivity}
                    onClose={() => setDrawerActivity(false)}
                    classes={{
                        paper: classes.drawerPaper,
                    }}
                    ModalProps={{
                        keepMounted: true, // Better open performance on mobile.
                    }}
                >
                    {drawer}
                </m.Drawer>
            </m.Hidden>
            <m.Hidden smDown implementation="js">
                <m.Drawer
                    variant="persistent"
                    open={drawerActivity}
                    onClose={() => setDrawerActivity(false)}
                    classes={{
                        paper: classes.drawerPaper,
                    }}
                >
                    {drawer}
                </m.Drawer>
            </m.Hidden>
        </nav>
    )
}

export default Drawer
