import { useCallback, useState } from "react"
import { createContainer } from "unstated-next"

function useDownloadDialog() {
    const [openDownloadDialog, setOpenDownloadDialog] = useState(false)
    const handleCloseDownloadDialog = useCallback(() => setOpenDownloadDialog(false), [])
    const handleOpenDownloadDialog = useCallback(() => setOpenDownloadDialog(true), [])
    return {
        openDownloadDialog,
        handleCloseDownloadDialog,
        handleOpenDownloadDialog,
    }
}

export const downloadDialogContainer = createContainer(useDownloadDialog)
