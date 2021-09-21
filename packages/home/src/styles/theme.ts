import { adaptV4Theme, createTheme } from "@mui/material/styles"

const theme = createTheme(
    adaptV4Theme({
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
    }),
)

export { theme }
