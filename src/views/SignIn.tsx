import * as m from "@material-ui/core"
import { sendSignInLink } from "src/controller"
import { useRouter } from "next/router"
import React, { useMemo, useState } from "react"
import clsx from "clsx"

const useStyles = m.makeStyles((theme: m.Theme) => {
    const cardPadding = 24
    return m.createStyles({
        container: {
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100vh",
            padding: theme.spacing(2),
        },
        card: {
            width: 512,
            paddingLeft: cardPadding,
            paddingRight: cardPadding,
        },
        progress: {
            marginLeft: -cardPadding,
            marginRight: -cardPadding,
        },
        hidden: {
            visibility: "hidden",
        },
        title: {
            paddingTop: 48,
        },
        content: {
            paddingTop: 32,
        },
        textField: {
            width: "100%",
        },
        actions: {
            padding: 16,
            paddingBottom: 40,
            justifyContent: "flex-end",
        },
    })
})

export default function SignIn() {
    const router = useRouter()
    const classes = useStyles()
    const [senting, setSenting] = useState(false)
    const [sented, setSented] = useState(false)
    const [error, setError] = useState("")
    const [email, setEmail] = useState("")
    const disableNext = useMemo(() => !email || senting, [email, senting])
    const signIn = () => {
        setSenting(true)
        setError("")
        sendSignInLink(email)
            .then(() => {
                setSented(true)
                // The link was successfully sent. Inform the user.
                // Save the email locally so you don't need to ask the user for it again
                // if they open the link on the same device.
                window.localStorage.setItem("emailForSignIn", email)
            })
            .catch(error => {
                setError(String(error))
                console.error(error)
            })
            .finally(() => {
                setSenting(false)
            })
    }
    const cancel = () => {
        router.push("/")
    }
    const back = () => {
        setError("")
        setSenting(false)
        setSented(false)
    }

    const signInCard = (
        <m.Card className={classes.card} data-testid="login-form-card">
            <m.LinearProgress
                className={
                    clsx(classes.progress, { [classes.hidden]: !senting })
                    // Use `visibility: hidden` to make sure that the card keep the same height while
                    // or while not senting
                }
            />
            <m.CardHeader className={classes.title} title="Sign-in with email"></m.CardHeader>
            <m.CardContent className={classes.content}>
                <m.TextField
                    disabled={senting}
                    className={classes.textField}
                    label="Email"
                    variant="filled"
                    autoFocus={true}
                    onChange={e => setEmail(e.target.value)}
                    value={email}
                    inputProps={{ "data-testid": "login-text-field" }}
                />
                {error && (
                    <m.Typography color="error" data-testid="login-error">
                        {error}
                    </m.Typography>
                )}
            </m.CardContent>
            <m.CardActions className={classes.actions}>
                <m.Button disabled={senting} onClick={cancel} data-testid="login-cancel-btn">
                    Cancel
                </m.Button>
                <m.Button
                    disabled={disableNext}
                    color="primary"
                    variant="contained"
                    onClick={signIn}
                    data-testid="login-next-btn"
                >
                    Next
                </m.Button>
            </m.CardActions>
        </m.Card>
    )
    const resultCard = (
        <m.Card className={classes.card} data-testid="login-result-card">
            <m.CardHeader className={classes.title} title="Sign-in email sent"></m.CardHeader>
            <m.CardContent className={classes.content} data-testid="login-message">
                <m.Typography>
                    A sign-in email with additional instructions was sent to{" "}
                    <strong>{email}</strong>. Check your email to complete sign-in.{" "}
                </m.Typography>
            </m.CardContent>
            <m.CardActions className={classes.actions}>
                <m.Button disabled={senting} onClick={back} data-testid="login-back-btn">
                    Back
                </m.Button>
            </m.CardActions>
        </m.Card>
    )

    return <div className={classes.container}>{sented ? resultCard : signInCard}</div>
}
