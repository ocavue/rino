import { createStyles, makeStyles } from "@material-ui/styles"
import React, { useEffect, useState } from "react"

import { useAuthInfo } from "../hooks"
import { breakpoints } from "../styles/breakpoint"
import { colors } from "../styles/color"
import { AppbarLogo } from "./appbar-logo"
import { Button, CloseIconButton } from "./button"

const useStyles = makeStyles(
    createStyles({
        root: {
            padding: ".5rem",
            right: "0",
            left: "0",
            top: "0",
            transformOrigin: "top right",
            position: "absolute",
            transition: "opacity 200ms ease, transform 200ms ease",
            willChange: "opacity, transform",

            [breakpoints.up.sm]: {
                display: "none",
            },
        },
        signIn: {
            color: colors.blue600,
            transitionTimingFunction: "cubic-bezier(0.4, 0, 0.2, 1)",
            transitionProperty: "color",
            transitionDuration: "150ms",
            "&:hover": {
                color: colors.blue500,
            },
        },
        menuShow: {
            opacity: 1,
            transform: "scale(1)",
        },
        menuHide: {
            opacity: 0,
            transform: "scale(0.95)",
        },
    }),
)

const boxShadow = "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)"

export const MobileMenu: React.FC<{
    activity: boolean
    setActivity: (next: boolean) => void
}> = ({ activity, setActivity }) => {
    const classes = useStyles()

    const [animationClassName, setAnimationClassName] = useState("")
    const [hidden, setHidden] = useState(true)

    useEffect(() => {
        if (activity) {
            setHidden(false)
            setTimeout(() => {
                setAnimationClassName(classes.menuShow)
            }, 20)
        } else {
            setAnimationClassName(classes.menuHide)
            setTimeout(() => {
                setHidden(true)
            }, 220)
        }
    }, [activity, classes])

    const authInfo = useAuthInfo()

    return (
        <div
            className={animationClassName + " " + classes.root}
            hidden={hidden}
            data-testid="homepage_appbar_mobile_menu"
        >
            <div
                style={{
                    borderRadius: "0.5rem",
                    boxShadow: boxShadow,
                }}
            >
                <div
                    style={{
                        background: "#ffffff",
                        borderRadius: "0.5rem",
                    }}
                >
                    <div
                        style={{
                            paddingTop: "1.25rem",
                            paddingBottom: "1.5rem",
                            paddingLeft: "1.25rem",
                            paddingRight: "1.25rem",

                            borderBottomWidth: "2px",
                            borderBottomColor: colors.gray100,
                            borderBottomStyle: "solid",
                        }}
                    >
                        <div
                            style={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "space-between",
                            }}
                        >
                            <AppbarLogo />
                            <span style={{ flex: 1 }} />
                            <div>
                                <CloseIconButton
                                    ariaLabel="Close"
                                    onClick={() => setActivity(false)}
                                    testid="homepage_appbar_mobile_menu_btn_close"
                                />
                            </div>
                        </div>
                    </div>
                    <div
                        style={{
                            paddingTop: "1.5rem",
                            paddingBottom: "1.5rem",
                            paddingLeft: "1.25rem",
                            paddingRight: "1.25rem",
                        }}
                    >
                        <Button
                            href={authInfo.isSSR ? "" : authInfo.signUpLink}
                            ariaLabel="Sign up"
                            testid=""
                            primary
                            shadow
                            fullWidth
                        >
                            Sign up
                        </Button>
                        <p
                            style={{
                                textAlign: "center",
                                fontSize: "1rem",
                                lineHeight: "1.5rem",
                                fontWeight: 500,
                                color: colors.gray500,
                                marginTop: "24px",
                            }}
                        >
                            Already have an account?{" "}
                            <a
                                className={classes.signIn}
                                href={authInfo.isSSR ? "" : authInfo.signUpLink}
                            >
                                Sign in
                            </a>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}
