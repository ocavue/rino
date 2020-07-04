import React, { useEffect, useState } from "react"

import { Logo } from "./appbar-logo"

export const MobileMenu: React.FC<{
    activity: boolean
    setActivity: (next: boolean) => void
}> = ({ activity, setActivity }) => {
    const [animationClassName, setAnimationClassName] = useState("")
    const [hidden, setHidden] = useState(true)

    useEffect(() => {
        if (activity) {
            setHidden(false)
            setTimeout(() => {
                setAnimationClassName("rino-mobile-menu-show")
            }, 20)
        } else {
            setAnimationClassName("rino-mobile-menu-hide")
            setTimeout(() => {
                setHidden(true)
            }, 220)
        }
    }, [activity])

    return (
        <div
            className={
                "absolute top-0 inset-x-0 p-2 origin-top-right md:hidden rino-mobile-menu " +
                animationClassName
            }
            hidden={hidden}
            data-testid="homepage_appbar_mobile_menu"
        >
            <div className="rounded-lg shadow-lg">
                <div className="rounded-lg shadow-xs bg-white divide-y-2 divide-gray-50">
                    <div className="pt-5 pb-6 px-5 space-y-6">
                        <div className="flex items-center justify-between">
                            <Logo />
                            <span className="flex-1" />
                            <div>
                                <button
                                    className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 transition duration-150 ease-in-out hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:bg-gray-100 focus:text-gray-500"
                                    type="button"
                                    onClick={() => setActivity(false)}
                                    data-testid="homepage_appbar_mobile_menu_btn_close"
                                >
                                    <svg
                                        className="h-6 w-6"
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
                                </button>
                            </div>
                        </div>
                    </div>
                    <div className="py-6 px-5 space-y-6">
                        <div className="space-y-6">
                            <span className="w-full flex rounded-md shadow-sm">
                                <a
                                    className="w-full flex items-center justify-center px-4 py-2 border border-transparent text-base leading-6 font-medium rounded-md text-white bg-blue-600 transition ease-in-out duration-150 hover:bg-blue-500 focus:outline-none focus:border-blue-700 focus:shadow-outline-blue active:bg-blue-700"
                                    href="/sign-up"
                                >
                                    Sign up
                                </a>
                            </span>
                            <p className="text-center text-base leading-6 font-medium text-gray-500">
                                Already have an account?{" "}
                                <a
                                    className="text-blue-600 transition ease-in-out duration-150 hover:text-blue-500"
                                    href="/sign-in"
                                >
                                    Sign in
                                </a>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
