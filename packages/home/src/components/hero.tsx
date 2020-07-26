import React from "react"

// Import a large image as base64 string is a bad practice!
import snapshot from "../static/snapshot_mac.png"

export const Hero: React.FC = () => (
    <div style={{ marginTop: "2.5rem" }}>
        <img src={snapshot} alt="Snapshot" />
    </div>
)
