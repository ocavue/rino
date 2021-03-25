/* Copyright (c) 2021-present ocavue@gmail.com */

import { TextField, TextFieldProps } from "@material-ui/core"
import React from "react"

type AuthTextFieldProps = Pick<TextFieldProps, "onChange" | "disabled" | "autoFocus" | "inputProps">

export const UsernameTextField: React.FC<AuthTextFieldProps> = (props) => {
    return (
        <TextField
            variant="outlined"
            margin="normal"
            fullWidth
            id="email"
            label="Email"
            name="email"
            autoComplete="email"
            autoFocus
            {...props}
        />
    )
}

const PasswordTextField: React.FC<AuthTextFieldProps> = (props) => {
    return (
        <TextField
            variant="outlined"
            margin="normal"
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            autoComplete="current-password"
            {...props}
        />
    )
}

export default PasswordTextField
