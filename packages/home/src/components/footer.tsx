/* Copyright (c) 2020-present ocavue@gmail.com */

import React from "react"

import { colors } from "../styles/color"

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
            marginTop: "5rem",
            marginBottom: "0",
            paddingTop: "5rem",
            paddingBottom: "5rem",
            backgroundColor: colors.gray100,
            width: "100%",
            display: "flex",
            justifyContent: "center",
        }}
    >
        <Link text="Twitter" href="https://twitter.com/rino_editor" />
        <Link text="Github" href="https://github.com/ocavue/rino" />
        <Link text="Email" href="mailto:support@rino.app" />
    </div>
)
