import { Box, SxProps } from "@mui/system"
import React from "react"

type HTMLImageProps = React.ComponentProps<"img">
type LogoProps = Pick<HTMLImageProps, "className" | "style"> & { sx?: SxProps }

export const Logo: React.FC<LogoProps> = (props) => {
    return <Box component="img" src="/share/img/icons/safari-pinned-tab.svg" alt="Rino Logo" {...props} />
}
