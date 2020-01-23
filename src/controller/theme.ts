export type Theme = "light" | "dark"
export const themes: Theme[] = ["light", "dark"]
export const defaultTheme: Theme = "dark"
const storeKey = "rinoTheme"
export const setTheme = (theme: Theme) => window.localStorage.setItem(storeKey, theme)
export const getTheme = (): Theme => {
    const theme = window.localStorage.getItem(storeKey) as Theme
    if (themes.includes(theme)) return theme
    else return defaultTheme
}
