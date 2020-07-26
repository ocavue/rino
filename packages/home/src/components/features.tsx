import { createStyles, makeStyles } from "@material-ui/styles"
import React from "react"

import { breakpoints } from "../styles/breakpoint"
import { colors } from "../styles/color"

const useStyles = makeStyles(
    createStyles({
        feature: {
            marginTop: "2.5rem",
            marginLeft: "auto",
            marginRight: "auto",
            paddingLeft: "1rem",
            paddingRight: "1rem",

            [breakpoints.up.sm]: {
                paddingLeft: "1.5rem",
                paddingRight: "1.5rem",
            },
            [breakpoints.up.lg]: {
                paddingLeft: "2rem",
                paddingRight: "2rem",
            },
        },
        blockContainer: {
            [breakpoints.up.md]: {
                display: "grid",
                gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
                gridColumnGap: "2rem",
                columnGap: "2rem",
                gridRowGap: "2.5rem",
                rowGap: "2.5rem",
            },
        },
        header: {
            [breakpoints.up.lg]: {
                textAlign: "center",
            },
        },
        headerText: {
            fontWeight: 700,
            fontSize: "2.25rem",
            lineHeight: "2.5rem",
            marginTop: ".5rem",
            color: colors.gray900,
            letterSpacing: "-.025em",
        },
    }),
)

const FeatureBlock: React.FC<{
    title: string
    desc: string
    svg: React.ReactNode
}> = ({ title, desc, svg }) => (
    <li>
        <div style={{ minHeight: "56px", display: "flex" }}>
            <div style={{ flexShrink: 0 }}>
                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        height: "3rem",
                        width: "3rem",
                        borderRadius: "0.375rem",
                        backgroundColor: colors.blue700,
                        color: "#ffffff",
                    }}
                >
                    {svg}
                </div>
            </div>
            <div
                style={{
                    marginLeft: "1rem",
                }}
            >
                <span
                    style={{
                        fontSize: "1.125rem",
                        lineHeight: "1.5rem",
                        fontWeight: 500,
                        color: colors.gray900,
                    }}
                >
                    {title}
                </span>
                <p
                    style={{
                        marginTop: "0.5rem",
                        fontSize: "1rem",
                        lineHeight: "1.5rem",
                        color: colors.gray500,
                    }}
                >
                    {desc}
                </p>
            </div>
        </div>
    </li>
)

export const Features: React.FC = () => {
    const classes = useStyles()

    // prettier-ignore
    const wysiwygSvg = (
        <svg viewBox="0 0 24 24" fill="white" style={{width: "1.5rem", height: "1.5rem"}}>
            <g>
                <rect fill="none" height="24" width="24" />
                <path d="M17,12H7v-2h10V12z M13,14H7v2h6V14z M21,21H3V3h18V21z M19,7H5v12h14V7z" />
            </g>
        </svg>
    )
    // prettier-ignore
    const cloudUploadSvg = (
        <svg viewBox="0 0 24 24" fill="white" style={{width: "1.5rem", height: "1.5rem"}}>
            <path d="M0 0h24v24H0z" fill="none" />
            <path d="M19.35 10.04C18.67 6.59 15.64 4 12 4 9.11 4 6.6 5.64 5.35 8.04 2.34 8.36 0 10.91 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96zM14 13v4h-4v-4H7l5-5 5 5h-3z" />
        </svg>
    )
    // prettier-ignore
    const offlineSvg = (
        <svg viewBox="0 0 24 24" fill="white" style={{width: "1.5rem", height: "1.5rem"}}>
            <g><rect fill="none" height="24" width="24" /></g>
            <g><g><g><path d="M12,2C6.5,2,2,6.5,2,12s4.5,10,10,10s10-4.5,10-10S17.5,2,12,2z M17,18H7v-2h10V18z M10.3,14L7,10.7l1.4-1.4l1.9,1.9 l5.3-5.3L17,7.3L10.3,14z" /></g></g></g>
        </svg>
    )
    // prettier-ignore
    const githubSvg = (
        <svg viewBox="0 0 24 24" fill="white" style={{width: "1.5rem", height: "1.5rem"}}>
            <title>GitHub icon</title>
            <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
        </svg>
    )

    return (
        <div className={classes.feature}>
            <div className={classes.header}>
                <h2 className={classes.headerText}>Why Rino?</h2>
            </div>
            <div style={{ marginTop: "2.5rem" }}>
                <ul className={classes.blockContainer}>
                    <FeatureBlock title="What you see is what you get" desc="" svg={wysiwygSvg} />
                    <FeatureBlock
                        title="Sync across all your devices"
                        desc=""
                        svg={cloudUploadSvg}
                    />
                    <FeatureBlock title="Work offline" desc="" svg={offlineSvg} />
                    <FeatureBlock title="Free and open source" desc="" svg={githubSvg} />
                </ul>
            </div>
        </div>
    )
}
