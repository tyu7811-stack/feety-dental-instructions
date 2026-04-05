import {
  BarChart3,
  FileText,
  FlaskConical,
  History,
  Inbox,
  Send,
  Stethoscope,
  Usb,
} from "lucide-react"
import { cn } from "@/lib/utils"
import {
  rolePersonaCompactIntro,
  rolePersonaLab,
  rolePersonaPartner,
  rolePersonaSection,
} from "@/lib/content/role-personas"

const bulletIcons = {
  send: Send,
  usb: Usb,
  history: History,
  inbox: Inbox,
  aggregate: BarChart3,
  pdf: FileText,
} as const

type Layout = "hero" | "plans"

export function RolePersonaCompactIntro({ layout }: { layout: Layout }) {
  if (layout === "plans") {
    return (
      <div className="mx-auto max-w-3xl space-y-2 text-center text-sm text-muted-foreground leading-relaxed sm:text-base">
        <p>
          <span className="font-medium text-foreground">
            {rolePersonaCompactIntro.clinicLead}
          </span>
          {rolePersonaCompactIntro.clinicTail}
        </p>
        <p>
          <span className="font-medium text-foreground">
            {rolePersonaCompactIntro.labLead}
          </span>
          {rolePersonaCompactIntro.labTail}
        </p>
      </div>
    )
  }

  return (
    <p className="max-w-2xl text-sm text-muted-foreground leading-relaxed sm:text-base">
      <span className="font-medium text-foreground">
        {rolePersonaCompactIntro.clinicLead}
      </span>
      {rolePersonaCompactIntro.clinicTail}
      <span className="mx-1 text-border">|</span>
      <span className="font-medium text-foreground">
        {rolePersonaCompactIntro.labLead}
      </span>
      {rolePersonaCompactIntro.labTail}
    </p>
  )
}

export function RolePersonaCards({ layout }: { layout: Layout }) {
  return (
    <div className={cn(layout === "plans" && "text-left")}>
      <h2
        className={cn(
          "text-lg font-bold tracking-tight text-foreground sm:text-xl",
          layout === "plans" && "text-center"
        )}
      >
        {rolePersonaSection.title}
      </h2>
      <p
        className={cn(
          "mt-2 max-w-2xl text-sm text-muted-foreground sm:text-base",
          layout === "plans" && "mx-auto max-w-2xl text-center"
        )}
      >
        {rolePersonaSection.subtitle}
      </p>
      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <div className="flex flex-col rounded-2xl border border-border bg-card p-6 shadow-sm">
          <div className="flex gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#1a6cf0]/10 text-[#1a6cf0]">
              <Stethoscope className="h-6 w-6" aria-hidden />
            </div>
            <div className="min-w-0">
              <p className="text-xs font-semibold uppercase tracking-wide text-[#1a6cf0]">
                {rolePersonaPartner.badge}
              </p>
              <p className="text-lg font-semibold leading-tight">
                {rolePersonaPartner.title}
              </p>
              <div className="mt-2 space-y-1 text-sm text-muted-foreground leading-relaxed">
                {rolePersonaPartner.lines.map((line) => (
                  <p key={line}>{line}</p>
                ))}
              </div>
            </div>
          </div>
          <ul className="mt-6 space-y-3 text-sm leading-relaxed">
            {rolePersonaPartner.bullets.map((item) => {
              const Icon = bulletIcons[item.id as keyof typeof bulletIcons]
              return (
                <li key={item.id} className="flex flex-col gap-1">
                  <span className="flex gap-3">
                    <Icon
                      className="mt-0.5 h-4 w-4 shrink-0 text-[#1a6cf0]"
                      aria-hidden
                    />
                    <span>
                      <span className="font-medium text-foreground">
                        {item.title}
                      </span>
                      <span className="text-muted-foreground">
                        {" "}
                        — {item.body}
                      </span>
                    </span>
                  </span>
                  {"disclaimer" in item && item.disclaimer ? (
                    <p className="ml-7 text-xs text-amber-700 dark:text-amber-500/90">
                      {item.disclaimer}
                    </p>
                  ) : null}
                </li>
              )
            })}
          </ul>
        </div>

        <div className="flex flex-col rounded-2xl border border-border bg-card p-6 shadow-sm ring-1 ring-[#1a6cf0]/15">
          <div className="flex gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#1a6cf0]/10 text-[#1a6cf0]">
              <FlaskConical className="h-6 w-6" aria-hidden />
            </div>
            <div className="min-w-0">
              <p className="text-xs font-semibold uppercase tracking-wide text-[#1a6cf0]">
                {rolePersonaLab.badge}
              </p>
              <p className="text-lg font-semibold leading-tight">
                {rolePersonaLab.title}
              </p>
              <div className="mt-2 space-y-1 text-sm text-muted-foreground leading-relaxed">
                {rolePersonaLab.lines.map((line) => (
                  <p key={line}>{line}</p>
                ))}
              </div>
            </div>
          </div>
          <ul className="mt-6 space-y-3 text-sm leading-relaxed">
            {rolePersonaLab.bullets.map((item) => {
              const Icon = bulletIcons[item.id as keyof typeof bulletIcons]
              return (
                <li key={item.id} className="flex gap-3">
                  <Icon
                    className="mt-0.5 h-4 w-4 shrink-0 text-[#1a6cf0]"
                    aria-hidden
                  />
                  <span>
                    <span className="font-medium text-foreground">
                      {item.title}
                    </span>
                    <span className="text-muted-foreground">
                      {" "}
                      — {item.body}
                    </span>
                  </span>
                </li>
              )
            })}
          </ul>
        </div>
      </div>
    </div>
  )
}
