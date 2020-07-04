import { useRouter } from "next/router"
import React from "react"

import { getCurrentUser } from "src/controller/auth/actions"
import { EditContainer } from "src/controller/edit"
import Alert from "src/views/Alert"

function DevCleanNotesConsumer() {
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

export default function DevCleanNotes() {
    return (
        <EditContainer.Provider>
            <DevCleanNotesConsumer />
        </EditContainer.Provider>
    )
}
