import React from "react"

import { colors } from "../styles/color"
import { DISCORD_LINK, GITHUB_LINK, MAILTO_LINK, TWITTER_LINK } from "./links"

const Link: React.FC<{ href: string; text: string }> = ({ href, text }) => (
    <a
        target="_blank"
        rel="noreferrer"
        href={href}
        style={{
            marginLeft: "1rem",
            marginRight: "1rem",
            color: colors.gray700,
        }}
    >
        {text}
    </a>
)

export const Footer: React.FC = () => (
    <div
        style={{
            position: "relative",
            marginBottom: "0",
            paddingTop: "5rem",
            paddingBottom: "5rem",
            width: "100%",
            display: "flex",
            justifyContent: "center",
        }}
    >
        <Link text="Twitter" href={TWITTER_LINK} />
        <Link text="Discord" href={DISCORD_LINK} />
        <Link text="Github" href={GITHUB_LINK} />
        <Link text="Email" href={MAILTO_LINK} />
    </div>
)
