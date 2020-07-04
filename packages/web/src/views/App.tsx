import { CssBaseline } from "@material-ui/core"
import { createMuiTheme } from "@material-ui/core"
import { ThemeProvider } from "@material-ui/core/styles"
import React, { useMemo } from "react"

import { StoreContainer } from "src/store"

const ContainerConsumer: React.FC = (props) => {
    const {
        state: { isDarkTheme },
    } = StoreContainer.useContainer()

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
            <ContainerConsumer>{props.children}</ContainerConsumer>
        </StoreContainer.Provider>
    )
}

export default App
