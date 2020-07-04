import { CssBaseline } from "@material-ui/core"
import { createMuiTheme } from "@material-ui/core"
import { ThemeProvider } from "@material-ui/core/styles"
import React, { useEffect, useMemo } from "react"

import { EditContainer, registerConnectionEvent } from "src/controller"
import { getCurrentUser, onAuthStateChanged } from "src/controller/auth/actions"
import { AuthContainer } from "src/controller/auth/hook"
import { StoreContainer } from "src/store"

const ContainerConsumer: React.FC = (props) => {
    const {
        state: { isDarkTheme, setConnected, setLoadingData },
    } = StoreContainer.useContainer()
    const { user, setUser, setLoadingUser } = AuthContainer.useContainer()

    const { fetchNotes, resetNotes } = EditContainer.useContainer()

    useEffect(() => {
        const unsubscribe = registerConnectionEvent((connected) => setConnected(connected))
        return () => unsubscribe()
    }, [setConnected])

    useEffect(() => {
        const unsubscribe = onAuthStateChanged((user) => {
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

    const lightTheme = useMemo(() => createMuiTheme({ palette: { type: "light" } }), [])
    const darkTheme = useMemo(
        () => createMuiTheme({ palette: { type: "dark", primary: { main: "#5599d6" } } }),
        [],
    )

    return (
        <ThemeProvider theme={isDarkTheme ? darkTheme : lightTheme}>
            <CssBaseline />
            {props.children}
        </ThemeProvider>
    )
}

const App: React.FC = (props) => {
    return (
        <StoreContainer.Provider>
            <EditContainer.Provider>
                <AuthContainer.Provider>
                    <ContainerConsumer>{props.children}</ContainerConsumer>
                </AuthContainer.Provider>
            </EditContainer.Provider>
        </StoreContainer.Provider>
    )
}

export default App
