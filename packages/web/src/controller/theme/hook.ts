/* Copyright (c) 2020-present ocavue@gmail.com */

import { useState } from "react"
import { createContainer } from "unstated-next"

type Theme = "light" | "dark"

const themes: Theme[] = ["light", "dark"]
const defaultTheme: Theme = "light"

const storeKey = "rinoTheme"

const setTheme = (theme: Theme) => window.localStorage.setItem(storeKey, theme)

const getTheme = (): Theme => {
    // `localStorage` doesn't exist when doing SSR
    if (typeof localStorage !== "undefined") {
        const theme = localStorage?.getItem(storeKey) as Theme
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
