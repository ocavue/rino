import type { FilledContext as HelmetFilledContext } from "react-helmet-async"

export type ServerEntryContext = Partial<HelmetFilledContext>

export type ServerEntry = (url: string, context: ServerEntryContext) => Promise<string>
