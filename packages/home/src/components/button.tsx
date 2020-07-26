import { createStyles, makeStyles } from "@material-ui/styles"
import React from "react"

import { colors } from "../styles/color"

type IconButtonProps = {
    onClick: () => void
    ariaLabel: string
    testid: string
}

type ButtonProps = {
    ariaLabel: string
    testid: string
    primary?: boolean
    fullWidth?: boolean
    shadow?: boolean
} & React.AnchorHTMLAttributes<HTMLAnchorElement>

const useIconButtonStyles = makeStyles(
    createStyles({
        btn: {
            margin: "0",
            cursor: "pointer",
            lineHeight: "inherit",
            borderRadius: ".375rem",
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            padding: ".5rem",
            TextOpacity: "1",
            transitionProperty: "background-color,color",
            transitionTimingFunction: "cubic-bezier(.4,0,.2,1)",
            transitionDuration: ".15s",
            color: colors.gray500,
            "&:hover": {
                color: colors.gray600,
                backgroundColor: colors.gray100,
            },
            "&:focus": {
                color: colors.gray600,
                backgroundColor: colors.gray100,
                outline: 0,
                boxShadow: "0 0 0 4px rgba(164, 202, 254, 0.45)",
            },
        },
    }),
)

const useTextButtonStyles = makeStyles(
    createStyles({
        btn: {
            borderRadius: ".375rem",
            borderWidth: "0px",
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            fontWeight: 500,
            fontSize: "1rem",
            lineHeight: "1.5rem",
            paddingTop: ".5rem",
            paddingBottom: ".5rem",
            paddingLeft: "1rem",
            paddingRight: "1rem",
            whiteSpace: "nowrap",
            transitionProperty: "background-color,border-color,color",
            transitionTimingFunction: "cubic-bezier(.4,0,.2,1)",
            transitionDuration: ".15s",
        },
        primary: {
            color: "#ffffff",
            background: colors.blue700,
            "&:hover": {
                background: colors.blue600,
            },
            "&:focus": {
                background: colors.blue600,
                outline: 0,
                boxShadow: "0 0 0 2px rgba(164, 202, 254, 0.45)",
            },
        },
        secondary: {
            color: colors.gray700,
            "&:hover": {
                backgroundColor: colors.gray100,
            },
            "&:focus": {
                backgroundColor: colors.gray100,
                outline: 0,
                boxShadow: "0 0 0 2px rgba(164, 202, 254, 0.45)",
            },
        },
        full: {
            width: "100%",
        },
        shadow: {
            boxShadow: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
        },
    }),
)

export const Button: React.FC<ButtonProps> = ({
    ariaLabel,
    testid,
    primary,
    children,
    fullWidth,
    shadow,
    ...extra
}) => {
    const classes = useTextButtonStyles()
    let className = `${classes.btn} ${primary ? classes.primary : classes.secondary}`
    if (fullWidth) {
        className += " "
        className += classes.full
    }
    if (shadow) {
        className += " "
        className += classes.shadow
    }
    return (
        <a
            {...extra}
            className={className}
            type="button"
            aria-label={ariaLabel}
            data-testid={testid}
        >
            {children}
        </a>
    )
}

export const IconButton: React.FC<IconButtonProps> = ({ onClick, ariaLabel, testid, children }) => {
    const classes = useIconButtonStyles()
    return (
        <button
            className={classes.btn}
            type="button"
            aria-label={ariaLabel}
            onClick={onClick}
            data-testid={testid}
        >
            {children}
        </button>
    )
}

export const CloseIconButton: React.FC<IconButtonProps> = (props) => {
    return (
        <IconButton {...props}>
            <svg
                style={{ height: "1.5rem", width: "1.5rem" }}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
            >
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                ></path>
            </svg>
        </IconButton>
    )
}

export const MoreIconButton: React.FC<IconButtonProps> = (props) => {
    return (
        <IconButton {...props}>
            <svg
                style={{ height: "1.5rem", width: "1.5rem" }}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
            >
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 6h16M4 12h16M4 18h16"
                ></path>
            </svg>
        </IconButton>
    )
}
