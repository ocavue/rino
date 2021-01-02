import { createStyles, makeStyles, Theme } from "@material-ui/core"
import React, { useEffect } from "react"

import Appbar from "src/components/Appbar"
import Content from "src/components/Content"
import Drawer from "src/components/Drawer"
import { AuthContainer } from "src/controller/auth/hook"
import { EditContainer } from "src/controller/edit"
import { registerConnectionEvent } from "src/controller/firebase/app"
import { WorksapceStateContainer } from "src/controller/workspace-state/hook"

const useStyles = makeStyles((theme: Theme) => {
    return createStyles({
        root: {
            height: "100vh",
            width: "100vw",
        },
    })
})

function WorkspaceConsumer() {
    const classes = useStyles()
    const { user } = AuthContainer.useContainer()
    const { setConnected, setLoadingData } = WorksapceStateContainer.useContainer()

    const { fetchNotes, resetNotes } = EditContainer.useContainer()

    useEffect(() => {
        const unsubscribe = registerConnectionEvent((connected) => setConnected(connected))
        return () => unsubscribe()
    }, [setConnected])

    useEffect(() => {
        const loadData = async () => {
            setLoadingData(true)
            try {
                if (user) {
                    await fetchNotes(user.uid)
                } else {
                    resetNotes()
                }
            } finally {
                setLoadingData(false)
            }
        }
        void loadData()
    }, [fetchNotes, resetNotes, setLoadingData, user])

    return (
        <div className={classes.root} data-testid="workspace">
            <Appbar />
            <Drawer />
            <Content />
        </div>
    )
}

export default function Workspace() {
    return (
        <WorksapceStateContainer.Provider>
            <AuthContainer.Provider>
                <EditContainer.Provider>
                    <WorkspaceConsumer />
                </EditContainer.Provider>
            </AuthContainer.Provider>
        </WorksapceStateContainer.Provider>
    )
}
