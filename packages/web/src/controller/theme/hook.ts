import { useState } from "react"
import { createContainer } from "unstated-next"

type Theme = "light" | "dark"

const themes: Theme[] = ["light", "dark"]
const defaultTheme: Theme = "light"

const storeKey = "rinoTheme"

const setTheme = (theme: Theme) => window.localStorage.setItem(storeKey, theme)

const getTheme = (): Theme => {
    return defaultTheme
    // when this function is called in the server, window.localStorage doesn't exist
    if (typeof window !== "undefined") {
        const theme = window?.localStorage?.getItem(storeKey) as Theme
        if (themes.includes(theme)) return theme
    }
    return defaultTheme
}

const useTheme = () => {
    const [isDarkTheme, setDarkTheme] = useState(getTheme() === "dark")
    const toggleTheme = () => {
        const newAppTheme = isDarkTheme ? "light" : "dark"
        setTheme(newAppTheme)
        setDarkTheme(!isDarkTheme)
    }
    return { isDarkTheme, toggleTheme }
}

export const ThemeContainer = createContainer(useTheme)
