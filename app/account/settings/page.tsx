'use client'

import { Suspense } from 'react'
import { AccountSettingsPage } from '@/components/account/account-settings'
import { Loader2 } from 'lucide-react'

function AccountSettingsSkeleton() {
  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="flex items-center justify-center h-96">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    </div>
  )
}

export default function AccountPage() {
  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">アカウント設定</h1>
      <Suspense fallback={<AccountSettingsSkeleton />}>
        <AccountSettingsPage />
      </Suspense>
    </div>
  )
}
