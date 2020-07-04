import { CssBaseline } from "@material-ui/core"
import { createMuiTheme } from "@material-ui/core"
import { ThemeProvider } from "@material-ui/core/styles"
import React, { useMemo } from "react"

import { ThemeContainer } from "src/controller/theme/hook"
import { StoreContainer } from "src/store"

const ThemeConsumer: React.FC = (props) => {
    const lightTheme = useMemo(() => createMuiTheme({ palette: { type: "light" } }), [])
    const darkTheme = useMemo(
        () => createMuiTheme({ palette: { type: "dark", primary: { main: "#5599d6" } } }),
        [],
    )
    const { isDarkTheme } = ThemeContainer.useContainer()

    return (
        <ThemeProvider theme={isDarkTheme ? darkTheme : lightTheme}>
            <CssBaseline />
            {props.children}
        </ThemeProvider>
    )
}

const App: React.FC = (props) => {
    return (
        <ThemeContainer.Provider>
            <StoreContainer.Provider>
                <ThemeConsumer>{props.children}</ThemeConsumer>
            </StoreContainer.Provider>
        </ThemeContainer.Provider>
    )
}

export default App
