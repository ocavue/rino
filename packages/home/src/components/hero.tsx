import React from "react"

// Import a large image as base64 string is a bad practice!
import snapshot from "../../../../art/snapshot_mac.png"

export const Hero: React.FC = () => (
    <div className="mt-10">
        <img src={snapshot} alt="Snapshot" />
    </div>
)
