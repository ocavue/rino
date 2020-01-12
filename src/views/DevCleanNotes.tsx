import { Note, getCurrentUser } from "src/controller"
import { StoreContainer } from "src/store"
import { useRouter } from "next/router"
import React from "react"

export default function DevCleanNotes() {
    const router = useRouter()
    const {
        edit: { setNotes, setNote },
    } = StoreContainer.useContainer()

    React.useEffect(() => {
        setTimeout(() => {
            const user = getCurrentUser()
            if (user) {
                Note.clean(user.uid)
                setNotes([])
                setNote(null)
                router.push(`/`)
            } else {
                const query = new URLSearchParams({ redirect: window.location.pathname }).toString()
                router.push(`/dev/sign-in?${query}`)
            }
        }, 500)
    }, [router, setNote, setNotes])

    return <div>dev clean notes</div>
}
