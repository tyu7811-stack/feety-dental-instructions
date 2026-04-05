import { notFound } from "next/navigation"
import { getLabCaseBundle } from "../actions"
import { LabCaseDetailClient } from "./lab-case-detail-client"

export default async function LabCaseDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const bundle = await getLabCaseBundle(id)
  if (!bundle) {
    notFound()
  }

  return (
    <LabCaseDetailClient
      caseData={bundle.caseData}
      clinicName={bundle.clinicName}
      clinicDoctorName={bundle.clinicDoctorName}
      documents={bundle.documents}
      disableMockPricing
    />
  )
}
