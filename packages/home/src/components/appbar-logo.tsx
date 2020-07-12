import React from "react"

import { Logo } from "./logo"

export const AppbarLogo: React.FC = () => (
    <div className="flex items-center">
        <Logo className="h-10 w-auto sm:h-12" />
        <span className="leading-6 font-medium text-gray-500 transition ease-in-out duration-150 hover:text-gray-900 focus:outline-none focus:text-gray-900 pl-4 sm:pl-6 text-xl sm:text-2xl">
            Rino
        </span>
    </div>
)
