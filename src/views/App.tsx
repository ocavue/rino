import { CssBaseline } from "@material-ui/core"
import { ThemeProvider } from "@material-ui/core/styles"
import { createMuiTheme } from "@material-ui/core"
import React, { useEffect, useMemo } from "react"

import { Note, getCurrentUser, onAuthStateChanged, registerConnectionEvent } from "src/controller"
import { StoreContainer } from "src/store"

const StoreContainerConsumer: React.FC = props => {
    const {
        state: { isDarkTheme, setConnected, setLoadingData, setLoadingUser },
        edit: { setNotes, setNote },
        auth: { user, setUser },
    } = StoreContainer.useContainer()

    useEffect(() => {
        const unsubscribe = registerConnectionEvent(connected => setConnected(connected))
        return () => unsubscribe()
    }, [setConnected])

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(user => {
            const currentUser = getCurrentUser()
            if (currentUser?.uid !== user?.uid) {
                console.warn(
                    `getCurrentUser return ${currentUser} but onAuthStateChanged call ${user}`,
                )
            }
            setUser(user)
            setLoadingUser(false)
            window.localStorage.setItem("__rino_dev_auth_state", user ? "yes" : "no")
        })
        return () => unsubscribe()
    }, [setLoadingUser, setUser])

    useEffect(() => {
        console.debug("create loadData")
        const loadData = async () => {
            setLoadingData(true)
            try {
                if (user) {
                    const notes = await Note.list(user.uid)
                    setNotes(notes)
                } else {
                    setNotes(null)
                    setNote(null)
                }
            } finally {
                setLoadingData(false)
            }
        }
        loadData()
    }, [setLoadingData, setNote, setNotes, user])

    const lightTheme = useMemo(() => createMuiTheme({ palette: { type: "light" } }), [])
    const darkTheme = useMemo(() => createMuiTheme({ palette: { type: "dark" } }), [])

    return (
        <ThemeProvider theme={isDarkTheme ? darkTheme : lightTheme}>
            <CssBaseline />
            {props.children}
        </ThemeProvider>
    )
}

const App: React.FC = props => {
    return (
        <StoreContainer.Provider>
            <StoreContainerConsumer>{props.children}</StoreContainerConsumer>
        </StoreContainer.Provider>
    )
}

export default App
