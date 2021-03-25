/* Copyright (c) 2020-present ocavue@gmail.com */

import { CssBaseline } from "@material-ui/core"
import { createMuiTheme } from "@material-ui/core"
import { ThemeProvider } from "@material-ui/core/styles"
import React from "react"

import { ThemeContainer } from "src/controller/theme/hook"
import { WorksapceStateContainer } from "src/controller/workspace-state/hook"

const lightTheme = createMuiTheme({ palette: { type: "light" } })
const darkTheme = createMuiTheme({ palette: { type: "dark", primary: { main: "#5599d6" } } })

const ThemeConsumer: React.FC = (props) => {
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
            <WorksapceStateContainer.Provider>
                <ThemeConsumer>{props.children}</ThemeConsumer>
            </WorksapceStateContainer.Provider>
        </ThemeContainer.Provider>
    )
}

export default App
