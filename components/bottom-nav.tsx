"use client"

import { Home, Snowflake, CheckCircle2, Plus } from "lucide-react"
import { cn } from "@/lib/utils"

type TabValue = "home" | "fridge" | "freezer" | "finished"

interface BottomNavProps {
  activeTab: TabValue
  onTabChange: (tab: TabValue) => void
  onAddClick: () => void
}

const tabs: { value: TabValue; label: string; icon: React.ElementType }[] = [
  { value: "home", label: "Home", icon: Home },
  { value: "fridge", label: "Fridge", icon: FridgeIcon },
  { value: "freezer", label: "Freezer", icon: Snowflake },
  { value: "finished", label: "Finished", icon: CheckCircle2 },
]

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

export function BottomNav({ activeTab, onTabChange, onAddClick }: BottomNavProps) {
  const leftTabs = tabs.slice(0, 2)
  const rightTabs = tabs.slice(2)

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-30 border-t border-border bg-card" role="tablist">
      <div className="mx-auto flex h-16 max-w-lg items-center justify-around px-2">
        {leftTabs.map((tab) => {
          const Icon = tab.icon
          const isActive = activeTab === tab.value
          return (
            <button
              key={tab.value}
              role="tab"
              aria-selected={isActive}
              onClick={() => onTabChange(tab.value)}
              className={cn(
                "flex flex-1 flex-col items-center gap-0.5 py-1 transition-colors",
                isActive ? "text-primary" : "text-muted-foreground"
              )}
            >
              <Icon className="size-5" />
              <span className="text-[11px] font-medium">{tab.label}</span>
              {isActive && (
                <span className="absolute bottom-0 h-0.5 w-8 rounded-full bg-primary" />
              )}
            </button>
          )
        })}

        <div className="flex flex-1 items-center justify-center">
          <button
            onClick={onAddClick}
            className="flex size-14 -translate-y-3 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg transition-transform hover:scale-105 active:scale-95"
            aria-label="Add new item"
          >
            <Plus className="size-7" />
          </button>
        </div>

        {rightTabs.map((tab) => {
          const Icon = tab.icon
          const isActive = activeTab === tab.value
          return (
            <button
              key={tab.value}
              role="tab"
              aria-selected={isActive}
              onClick={() => onTabChange(tab.value)}
              className={cn(
                "flex flex-1 flex-col items-center gap-0.5 py-1 transition-colors",
                isActive ? "text-primary" : "text-muted-foreground"
              )}
            >
              <Icon className="size-5" />
              <span className="text-[11px] font-medium">{tab.label}</span>
              {isActive && (
                <span className="absolute bottom-0 h-0.5 w-8 rounded-full bg-primary" />
              )}
            </button>
          )
        })}
      </div>
    </nav>
  )
}
