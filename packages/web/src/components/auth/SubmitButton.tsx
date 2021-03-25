/* Copyright (c) 2021-present ocavue@gmail.com */

import { Button, ButtonProps, createStyles, withStyles } from "@material-ui/core"
import React from "react"

const StyledButton = withStyles(
    createStyles({
        root: {
            // By default, Button has "textTransform: uppercase" CSS
            textTransform: "none",
            marginTop: 16,
            marginBottom: 24,
            height: 56,
            fontSize: "1.1rem",
            fontWeight: 500,
        },
    }),
)(Button)

const SubmitButton: React.FC<ButtonProps> = (props) => (
    <StyledButton type="submit" fullWidth variant="contained" color="primary" size="large" {...props} />
)

export default SubmitButton
