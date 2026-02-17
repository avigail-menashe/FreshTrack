"use client"

import { Snowflake, PackageOpen } from "lucide-react"
import { FoodItemCard } from "@/components/food-item-card"
import { useLocationItems } from "@/hooks/use-food-items"
import type { StorageLocation } from "@/lib/types"

interface FoodListProps {
  location: StorageLocation
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

const locationConfig = {
  fridge: {
    label: "Fridge",
    icon: FridgeIcon,
    iconBg: "bg-primary text-primary-foreground",
    emptyTitle: "Your fridge is empty",
    emptyDescription: "Tap the + button to start tracking items.",
  },
  freezer: {
    label: "Freezer",
    icon: Snowflake,
    iconBg: "bg-blue-600 text-blue-50",
    emptyTitle: "Your freezer is empty",
    emptyDescription: "Tap the + button to add frozen items.",
  },
}

export function FoodList({ location }: FoodListProps) {
  const { data: items = [], isLoading } = useLocationItems(location)
  const config = locationConfig[location]
  const Icon = config.icon

  if (isLoading) {
    return (
      <div className="flex flex-col gap-3 p-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-28 animate-pulse rounded-xl bg-muted" />
        ))}
      </div>
    )
  }

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 px-4 py-20 text-center">
        <div className="flex items-center justify-center rounded-full bg-muted p-4">
          <PackageOpen className="size-8 text-muted-foreground" />
        </div>
        <div>
          <p className="font-medium text-foreground">{config.emptyTitle}</p>
          <p className="mt-1 text-sm text-muted-foreground">
            {config.emptyDescription}
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-4 p-4">
      <div className="flex items-center gap-3">
        <div className={`flex size-10 items-center justify-center rounded-xl ${config.iconBg}`}>
          <Icon className="size-5" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-bold text-foreground">{config.label}</h2>
            <span className="inline-flex size-5 items-center justify-center rounded-full bg-primary/10 text-[11px] font-bold text-primary">
              {items.length}
            </span>
          </div>
          <p className="text-xs text-muted-foreground">
            Sorted by expiration date
          </p>
        </div>
      </div>

      <div className="flex flex-col gap-3">
        {items.map((item) => (
          <FoodItemCard key={item.id} item={item} />
        ))}
      </div>
    </div>
  )
}
