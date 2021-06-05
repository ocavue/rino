import { createStyles, makeStyles } from "@material-ui/core"
import React, { ImgHTMLAttributes } from "react"

import { rootLevelBlock } from "../styles/layout"

export type HeroProps = {
    imageProps: ImgHTMLAttributes<HTMLImageElement>
}

const useStyles = makeStyles((theme) =>
    createStyles({
        hero: {
            ...rootLevelBlock,
            marginTop: "32px",
        },
        img: {
            width: "100%",
            height: "100%",

            [theme.breakpoints.up("md")]: {
                paddingLeft: 16,
                paddingRight: 16,
            },
        },
    }),
)

export const Hero: React.FC<HeroProps> = ({ imageProps }) => {
    const classes = useStyles()

    return (
        <div className={classes.hero}>
            <img {...imageProps} alt="Snapshot" className={classes.img} />
        </div>
    )
}
