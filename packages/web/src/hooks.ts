import { Theme, useMediaQuery } from "@material-ui/core"

export function useIsMobile(): boolean {
    return useMediaQuery((theme: Theme) => theme.breakpoints.down("sm"))
}
