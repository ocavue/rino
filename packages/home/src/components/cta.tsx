import React from "react"

import { Logo } from "./logo"

// call-to-action
export const CTA: React.FC = () => (
    <div className="flex flex-col items-center" style={{ marginTop: 144, marginBottom: 144 }}>
        <Logo className="h-24 w-auto" />
        <h2
            className="text-4xl leading-10 font-bold text-gray-900"
            style={{ marginTop: 32, marginBottom: 32 }}
        >
            Get started with Rino
        </h2>
        <a
            className="whitespace-no-wrap inline-flex items-center justify-center px-4 py-2 border border-transparent text-base leading-6 font-medium rounded-md text-white bg-blue-600 transition ease-in-out duration-150 hover:bg-blue-500 focus:outline-none focus:border-blue-700 focus:shadow-outline-blue active:bg-blue-700"
            href="/sign-up"
            data-testid="homepage_signup_btn"
        >
            Create an account
        </a>
    </div>
)
