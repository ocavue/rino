import { TextField, TextFieldProps } from "@material-ui/core"
import React from "react"

type AuthTextFieldProps = Pick<TextFieldProps, "onChange" | "disabled" | "autoFocus" | "inputProps">

const UsernameTextField: React.FC<AuthTextFieldProps> = (props) => {
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

export default UsernameTextField
