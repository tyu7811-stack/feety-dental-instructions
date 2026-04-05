import { notFound } from "next/navigation"
import { DebugTestEntryClient } from "./debug-test-entry-client"

export default function DebugTestEntryPage() {
  if (process.env.NODE_ENV === "production") {
    notFound()
  }

  return <DebugTestEntryClient />
}
