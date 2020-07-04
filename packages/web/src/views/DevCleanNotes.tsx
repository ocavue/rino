import { useRouter } from "next/router"
import React from "react"

import { EditContainer } from "src/controller"
import { getCurrentUser } from "src/controller/auth/actions"
import Alert from "src/views/Alert"

export default function DevCleanNotes() {
    const router = useRouter()
    const { removeAllNotes } = EditContainer.useContainer()

    React.useEffect(() => {
        const timeout = setTimeout(() => {
            const user = getCurrentUser()
            void removeAllNotes(user?.uid).then(() => router.push(`/`))
        }, 2000)
        return () => clearTimeout(timeout)
    }, [removeAllNotes, router])

    return <Alert title="clean notes" message="development" />
}
