import React from "react"

// Import a large image as base64 string is a bad practice!
import snapshot from "../../public/share/snapshot-mac-1317x762.png"

export const Hero: React.FC = () => (
    <div style={{ marginTop: "2.5rem" }}>
        <img src={snapshot} alt="Snapshot" />
    </div>
)
