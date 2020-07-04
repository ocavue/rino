import React from "react"

export const AppbarAuth: React.FC = () => (
    <div className="hidden items-center justify-end space-x-8 sm:flex sm:flex-1 lg:w-0">
        <a
            className="whitespace-no-wrap text-base leading-6 font-medium text-gray-500 hover:text-gray-900 focus:outline-none focus:text-gray-900"
            href="/sign-in"
            data-testid="homepage_signin_btn"
        >
            Sign in
        </a>
        <span className="inline-flex rounded-md shadow-sm">
            <a
                className="whitespace-no-wrap inline-flex items-center justify-center px-4 py-2 border border-transparent text-base leading-6 font-medium rounded-md text-white bg-blue-600 transition ease-in-out duration-150 hover:bg-blue-500 focus:outline-none focus:border-blue-700 focus:shadow-outline-blue active:bg-blue-700"
                href="/sign-up"
                data-testid="homepage_signup_btn"
            >
                Sign up
            </a>
        </span>
    </div>
)
