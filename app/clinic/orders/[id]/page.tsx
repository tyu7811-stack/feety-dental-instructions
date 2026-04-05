import { notFound } from "next/navigation"
import { getClinicCaseBundle } from "../actions"
import { ClinicOrderDetailClient } from "./clinic-order-detail-client"

export default async function ClinicOrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const bundle = await getClinicCaseBundle(id)
  if (!bundle) {
    notFound()
  }

  return (
    <ClinicOrderDetailClient
      caseData={bundle.caseData}
      clinicName={bundle.clinicName}
      clinicAddress={bundle.clinicAddress}
    />
  )
}
