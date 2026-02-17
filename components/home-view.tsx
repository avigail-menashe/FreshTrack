"use client"

import { format } from "date-fns"
import { AlertTriangle, ChevronRight, Home, Snowflake, CheckCircle2 } from "lucide-react"
import { useFridgeItems, useFreezerItems, useFinishedItems } from "@/hooks/use-food-items"
import { getExpirationStatus } from "@/lib/food-store"

interface HomeViewProps {
  onNavigate: (tab: "fridge" | "freezer" | "finished") => void
}

function FridgeIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M5 6a4 4 0 0 1 4-4h6a4 4 0 0 1 4 4v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6Z" />
      <path d="M5 10h14" />
      <path d="M15 7v0" />
      <path d="M15 13v0" />
    </svg>
  )
}

export function HomeView({ onNavigate }: HomeViewProps) {
  const { data: fridgeItems = [] } = useFridgeItems()
  const { data: freezerItems = [] } = useFreezerItems()
  const { data: finishedItems = [] } = useFinishedItems()

  const allActive = [...fridgeItems, ...freezerItems]
  const expiringCount = allActive.filter((item) => {
    const status = getExpirationStatus(item.expirationDate)
    return status === "warning" || status === "expired"
  }).length

  const fridgeExpiring = fridgeItems.filter((item) => {
    const status = getExpirationStatus(item.expirationDate)
    return status === "warning" || status === "expired"
  }).length

  const freezerExpiring = freezerItems.filter((item) => {
    const status = getExpirationStatus(item.expirationDate)
    return status === "warning" || status === "expired"
  }).length

  const today = format(new Date(), "EEEE, MMMM d")

  return (
    <div className="flex flex-col gap-4 p-4">
      <header className="flex flex-col gap-1">
        <span className="text-xs font-bold uppercase tracking-wider text-primary">
          FreshTrack
        </span>
        <h1 className="text-2xl font-bold text-foreground text-balance">
          Your Kitchen
        </h1>
        <p className="text-sm text-muted-foreground">{today}</p>
      </header>

      {expiringCount > 0 && (
        <div className="flex items-center gap-3 rounded-xl bg-amber-50 px-4 py-3 border border-amber-200">
          <div className="flex items-center justify-center rounded-full bg-amber-100 p-2">
            <AlertTriangle className="size-5 text-amber-600" />
          </div>
          <div>
            <p className="text-sm font-semibold text-amber-800">
              {expiringCount} expiring soon
            </p>
            <p className="text-xs text-amber-600">
              Check your items and take action
            </p>
          </div>
        </div>
      )}

      <div className="flex flex-col gap-3">
        <button
          onClick={() => onNavigate("fridge")}
          className="flex items-center gap-4 rounded-xl border border-border bg-card p-4 transition-colors hover:bg-secondary/50 text-left"
        >
          <div className="flex size-12 items-center justify-center rounded-xl bg-primary text-primary-foreground">
            <FridgeIcon className="size-6" />
          </div>
          <div className="flex-1">
            <p className="font-semibold text-foreground">Fridge</p>
            <p className="text-sm text-muted-foreground">
              {fridgeItems.length} {fridgeItems.length === 1 ? "item" : "items"}
            </p>
          </div>
          <div className="flex items-center gap-2">
            {fridgeExpiring > 0 && (
              <span className="inline-flex items-center gap-1 rounded-md bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-800">
                {fridgeExpiring} <AlertTriangle className="size-3" />
              </span>
            )}
            <ChevronRight className="size-5 text-muted-foreground" />
          </div>
        </button>

        <button
          onClick={() => onNavigate("freezer")}
          className="flex items-center gap-4 rounded-xl border border-border bg-card p-4 transition-colors hover:bg-secondary/50 text-left"
        >
          <div className="flex size-12 items-center justify-center rounded-xl bg-blue-600 text-blue-50">
            <Snowflake className="size-6" />
          </div>
          <div className="flex-1">
            <p className="font-semibold text-foreground">Freezer</p>
            <p className="text-sm text-muted-foreground">
              {freezerItems.length} {freezerItems.length === 1 ? "item" : "items"}
            </p>
          </div>
          <div className="flex items-center gap-2">
            {freezerExpiring > 0 && (
              <span className="inline-flex items-center gap-1 rounded-md bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-800">
                {freezerExpiring} <AlertTriangle className="size-3" />
              </span>
            )}
            <ChevronRight className="size-5 text-muted-foreground" />
          </div>
        </button>

        <button
          onClick={() => onNavigate("finished")}
          className="flex items-center gap-4 rounded-xl border border-border bg-card p-4 transition-colors hover:bg-secondary/50 text-left"
        >
          <div className="flex size-12 items-center justify-center rounded-xl bg-stone-500 text-stone-50">
            <CheckCircle2 className="size-6" />
          </div>
          <div className="flex-1">
            <p className="font-semibold text-foreground">Finished</p>
            <p className="text-sm text-muted-foreground">
              {finishedItems.length} {finishedItems.length === 1 ? "item" : "items"}
              {finishedItems.length > 0 && " \u00B7 Consumed recently"}
            </p>
          </div>
          <ChevronRight className="size-5 text-muted-foreground" />
        </button>
      </div>
    </div>
  )
}
