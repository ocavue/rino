import React from "react"

const Center: React.FC = (props) => {
    return (
        <div
            style={{
                position: "fixed",
                left: "50%",
                top: "50%",
                transform: "translateX(-50%) translateY(-50%)",
                width: "100%",
                padding: "8px",

                display: "flex",
                alignItems: "center",
                flexDirection: "column",
            }}
            {...props}
        />
    )
}

export default Center
