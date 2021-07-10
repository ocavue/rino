import { createTheme } from "@material-ui/core/styles"

const theme = createTheme({
    overrides: {
        // Style sheet name ⚛️
        MuiButton: {
            // Name of the rule
            root: {
                // Some CSS
                textTransform: "capitalize",
            },
        },
    },
    palette: {
        primary: {
            main: "#2e93c1",
        },
    },
})

export { theme }
