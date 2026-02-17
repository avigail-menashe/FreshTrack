"use client"

import { CheckCircle2 } from "lucide-react"
import { FoodItemCard } from "@/components/food-item-card"
import { useFinishedItems } from "@/hooks/use-food-items"

export function FinishedItems() {
  const { data: items = [], isLoading } = useFinishedItems()

  if (isLoading) {
    return (
      <div className="flex flex-col gap-3 p-4">
        {[1, 2].map((i) => (
          <div key={i} className="h-28 animate-pulse rounded-xl bg-muted" />
        ))}
      </div>
    )
  }

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 px-4 py-20 text-center">
        <div className="flex items-center justify-center rounded-full bg-muted p-4">
          <CheckCircle2 className="size-8 text-muted-foreground" />
        </div>
        <div>
          <p className="font-medium text-foreground">No finished items</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Items you mark as consumed will appear here for 24 hours.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-4 p-4">
      <div className="flex items-center gap-3">
        <div className="flex size-10 items-center justify-center rounded-xl bg-stone-500 text-stone-50">
          <CheckCircle2 className="size-5" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-bold text-foreground">Finished</h2>
            <span className="inline-flex size-5 items-center justify-center rounded-full bg-stone-200 text-[11px] font-bold text-stone-600">
              {items.length}
            </span>
          </div>
          <p className="text-xs text-muted-foreground">
            Auto-removed after 24 hours
          </p>
        </div>
      </div>

      <div className="flex flex-col gap-3">
        {items.map((item) => (
          <FoodItemCard key={item.id} item={item} isFinished />
        ))}
      </div>
    </div>
  )
}
