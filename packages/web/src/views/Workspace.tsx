import { createStyles, makeStyles, Theme } from "@material-ui/core"
import React, { useEffect } from "react"

import { Appbar } from "src/components/Appbar"
import { Content } from "src/components/Content"
import { Drawer } from "src/components/Drawer"
import { SignInSnackbar } from "src/components/SignInSnackbar"
import { EditContainer, registerConnectionEvent } from "src/controller"
import { AuthContainer } from "src/controller/auth/hook"
import { StoreContainer } from "src/store"

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
    const {
        state: { setConnected, setLoadingData },
    } = StoreContainer.useContainer()

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
            <SignInSnackbar />
        </div>
    )
}

export default function Workspace() {
    return (
        <AuthContainer.Provider>
            <EditContainer.Provider>
                <WorkspaceConsumer />
            </EditContainer.Provider>
        </AuthContainer.Provider>
    )
}
