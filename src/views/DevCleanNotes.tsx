import { EditContainer, getCurrentUser } from "src/controller"
import { useRouter } from "next/router"
import React from "react"

export default function DevCleanNotes() {
    const router = useRouter()
    const { removeAllNotes } = EditContainer.useContainer()

    React.useEffect(() => {
        const timeout = setTimeout(() => {
            const user = getCurrentUser()
            removeAllNotes(user?.uid)
            router.push(`/`)
        }, 2000)
        return () => clearTimeout(timeout)
    }, [removeAllNotes, router])

    return <div>dev clean notes</div>
}
