import React from "react"

// Import a large image as base64 string is a bad practice!

export type HeroProps = {
    imageSrc: string
}

export const Hero: React.FC<HeroProps> = ({ imageSrc }) => (
    <div style={{ marginTop: "2.5rem" }}>
        <img src={imageSrc} alt="Snapshot" width="1317" height="762" />
    </div>
)
