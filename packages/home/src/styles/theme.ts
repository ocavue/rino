import { createTheme } from "@mui/material/styles"

const theme = createTheme({
    components: {
        // Style sheet name ⚛️
        MuiButton: {
            styleOverrides: {
                // Name of the rule
                root: {
                    // Some CSS
                    textTransform: "capitalize",
                },
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
