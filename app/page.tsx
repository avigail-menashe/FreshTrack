"use client"

import { useState } from "react"
import { BottomNav } from "@/components/bottom-nav"
import { HomeView } from "@/components/home-view"
import { FoodList } from "@/components/food-list"
import { FinishedItems } from "@/components/finished-items"
import { AddItemDialog } from "@/components/add-item-dialog"

type TabValue = "home" | "fridge" | "freezer" | "finished"

export default function HomePage() {
  const [activeTab, setActiveTab] = useState<TabValue>("home")
  const [addDialogOpen, setAddDialogOpen] = useState(false)

  const defaultLocation =
    activeTab === "fridge"
      ? ("fridge" as const)
      : activeTab === "freezer"
        ? ("freezer" as const)
        : undefined

  return (
    <div className="mx-auto flex min-h-dvh max-w-lg flex-col bg-background">
      <main className="flex-1 pb-20">
        {activeTab === "home" && (
          <HomeView
            onNavigate={(tab) => setActiveTab(tab)}
          />
        )}
        {activeTab === "fridge" && <FoodList location="fridge" />}
        {activeTab === "freezer" && <FoodList location="freezer" />}
        {activeTab === "finished" && <FinishedItems />}
      </main>

      <BottomNav
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onAddClick={() => setAddDialogOpen(true)}
      />

      <AddItemDialog
        open={addDialogOpen}
        onOpenChange={setAddDialogOpen}
        defaultLocation={defaultLocation}
      />
    </div>
  )
}
