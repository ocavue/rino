/* Copyright (c) 2021-present ocavue@gmail.com */

import React from "react"

type OnSubmit = (event: React.FormEvent<HTMLFormElement>) => void

const AuthForm: React.FC<{ onSubmit: OnSubmit }> = (props) => {
    return (
        <form
            style={{
                paddingTop: 16,
                width: "100%" /* Fix IE 11 issue. */,
            }}
            noValidate
            {...props}
        ></form>
    )
}

export default AuthForm
