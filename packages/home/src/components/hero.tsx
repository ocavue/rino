/* Copyright (c) 2020-present ocavue@gmail.com */

import React, { ImgHTMLAttributes } from "react"

export type HeroProps = {
    imageProps: ImgHTMLAttributes<HTMLImageElement>
}

export const Hero: React.FC<HeroProps> = ({ imageProps }) => (
    <div style={{ marginTop: "2.5rem" }}>
        <img {...imageProps} alt="Snapshot" style={{ width: "100%" }} />
    </div>
)
