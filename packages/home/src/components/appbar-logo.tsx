import React from "react"

import logo from "../../../web/public/img/icons/safari-pinned-tab.svg"

export const Logo: React.FC = () => (
    <div className="flex items-center">
        <img className="h-10 w-auto sm:h-12" src={logo} alt="Rino" />
        <span className="leading-6 font-medium text-gray-500 transition ease-in-out duration-150 hover:text-gray-900 focus:outline-none focus:text-gray-900 pl-4 sm:pl-6 text-xl sm:text-2xl">
            Rino
        </span>
    </div>
)

export const AppbarLogo: React.FC = () => (
    <a className="lg:w-0 lg:flex-1 items-center justify-start flex flex-1" href="#">
        <Logo />
    </a>
)
