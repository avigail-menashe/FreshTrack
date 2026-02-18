"use client"

import { format } from "date-fns"
import { CalendarDays, Clock, Check, Trash2, Undo2 } from "lucide-react"
import { cn } from "@/lib/utils"
import {
  getExpirationStatus,
  getDaysLeft,
  markAsFinished,
  deleteItem,
  restoreItem,
} from "@/lib/food-store"
import { mutateAll } from "@/hooks/use-food-items"
import type { FoodItem } from "@/lib/types"
import { CATEGORY_EMOJIS } from "@/lib/types"

interface FoodItemCardProps {
  item: FoodItem
  isFinished?: boolean
}

export function FoodItemCard({ item, isFinished = false }: FoodItemCardProps) {
  const status = getExpirationStatus(item.expiry_date)
  const daysLeft = getDaysLeft(item.expiry_date)

  const dateStr = item.expiry_date
    ? format(new Date(item.expiry_date), "EEE, MMM d")
    : null
  const timeStr = item.entry_time || null

  async function handleMarkFinished() {
    await markAsFinished(item.id)
    mutateAll()
  }

  async function handleDelete() {
    await deleteItem(item.id)
    mutateAll()
  }

  async function handleRestore() {
    await restoreItem(item.id)
    mutateAll()
  }

  const borderColor = isFinished
    ? "border-l-stone-300"
    : status === "expired"
      ? "border-l-red-400"
      : status === "warning"
        ? "border-l-amber-400"
        : status === "none"
          ? "border-l-stone-300"
          : "border-l-emerald-400"

  const badgeStyle = isFinished
    ? "bg-stone-100 text-stone-500"
    : status === "expired"
      ? "bg-red-50 text-red-600 border-red-200"
      : status === "warning"
        ? "bg-amber-50 text-amber-600 border-amber-200"
        : status === "none"
          ? "bg-stone-100 text-stone-500 border-stone-200"
          : "bg-emerald-50 text-emerald-600 border-emerald-200"

  const badgeText = isFinished
    ? "Consumed"
    : status === "expired"
      ? `Expired ${Math.abs(daysLeft!)}d ago`
      : status === "warning"
        ? daysLeft === 0
          ? "Today"
          : `${daysLeft}d left`
        : status === "none"
          ? "No expiry"
          : daysLeft === 0
            ? "Today"
            : `${daysLeft}d left`

  return (
    <div
      className={cn(
        "rounded-xl border border-l-4 bg-card transition-all",
        borderColor,
        isFinished && "opacity-70"
      )}
    >
      <div className="flex items-start gap-3 p-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div>
              <h3
                className={cn(
                  "font-semibold text-foreground leading-tight",
                  isFinished && "line-through text-muted-foreground"
                )}
              >
                <span className="mr-1.5">{CATEGORY_EMOJIS[item.category] || CATEGORY_EMOJIS.other}</span>
                {item.name}
              </h3>
              {item.notes && (
                <p className="text-sm text-muted-foreground mt-0.5">
                  {item.notes}
                </p>
              )}
            </div>

            <span
              className={cn(
                "inline-flex shrink-0 items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-semibold",
                badgeStyle
              )}
            >
              {!isFinished && status === "ok" && (
                <svg className="size-3" viewBox="0 0 12 12" fill="none">
                  <circle cx="6" cy="6" r="5" stroke="currentColor" strokeWidth="1.5" />
                  <path d="M4 6l1.5 1.5L8 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              )}
              {badgeText}
            </span>
          </div>

          <div className="mt-2 flex items-center gap-3 text-xs text-muted-foreground">
            {dateStr && (
              <span className="inline-flex items-center gap-1">
                <CalendarDays className="size-3.5" />
                {dateStr}
              </span>
            )}
            {timeStr && (
              <span className="inline-flex items-center gap-1">
                <Clock className="size-3.5" />
                {timeStr}
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="flex items-center border-t border-border px-4 py-2">
        {isFinished ? (
          <>
            <button
              onClick={handleRestore}
              className="mx-auto flex items-center gap-1.5 text-sm font-medium text-primary transition-colors hover:text-primary/80"
            >
              <Undo2 className="size-4" />
              Restore
            </button>
            <button
              onClick={handleDelete}
              className="ml-auto text-muted-foreground transition-colors hover:text-destructive"
              aria-label="Delete item"
            >
              <Trash2 className="size-4" />
            </button>
          </>
        ) : (
          <>
            <button
              onClick={handleMarkFinished}
              className="mx-auto flex items-center gap-1.5 text-sm font-medium text-primary transition-colors hover:text-primary/80"
            >
              <Check className="size-4" />
              Consumed
            </button>
            <button
              onClick={handleDelete}
              className="ml-auto text-muted-foreground transition-colors hover:text-destructive"
              aria-label="Delete item"
            >
              <Trash2 className="size-4" />
            </button>
          </>
        )}
      </div>
    </div>
  )
}
