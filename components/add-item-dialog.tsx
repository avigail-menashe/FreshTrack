"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { addItem } from "@/lib/food-store"
import { mutateAll } from "@/hooks/use-food-items"
import type { StorageLocation, FoodCategory } from "@/lib/types"
import { CATEGORY_LABELS, CATEGORY_EMOJIS } from "@/lib/types"

const FOOD_CATEGORIES: FoodCategory[] = [
  "dairy",
  "vegetables",
  "fruits",
  "meat",
  "fish",
  "frozen",
  "beverages",
  "grains",
  "snacks",
  "condiments",
  "other",
]

interface AddItemDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  defaultLocation?: StorageLocation
}

export function AddItemDialog({ open, onOpenChange, defaultLocation }: AddItemDialogProps) {
  const [name, setName] = useState("")
  const [expiryDate, setExpiryDate] = useState("")
  const [expiryTime, setExpiryTime] = useState("")
  const [location, setLocation] = useState<StorageLocation | "">(defaultLocation ?? "")
  const [category, setCategory] = useState<FoodCategory>("other")
  const [notes, setNotes] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // If we have a default location (user is on fridge/freezer tab), use it
  const effectiveLocation = defaultLocation || location

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!name || !effectiveLocation || !expiryDate) return

    setIsSubmitting(true)
    setError(null)
    try {
      const today = new Date().toISOString().split("T")[0]
      console.log("[v0] handleSubmit - submitting:", { name, location: effectiveLocation, category, expiryDate })
      const result = await addItem({
        name,
        location: effectiveLocation as StorageLocation,
        category,
        entry_date: today,
        entry_time: expiryTime || null,
        expiry_date: expiryDate || null,
        notes: notes || null,
      })
      console.log("[v0] handleSubmit - result:", result)

      if (!result) {
        setError("Failed to add item. Please make sure you are logged in.")
        return
      }

      mutateAll()
      resetForm()
      onOpenChange(false)
    } catch (err) {
      console.error("[v0] handleSubmit - error:", err)
      setError("An unexpected error occurred. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  function resetForm() {
    setName("")
    setExpiryDate("")
    setExpiryTime("")
    setLocation(defaultLocation ?? "")
    setCategory("other")
    setNotes("")
    setError(null)
  }

  const isValid = name && effectiveLocation && expiryDate

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add New Item</DialogTitle>
          <DialogDescription>
            Track a new item in your {defaultLocation || "fridge or freezer"}.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="item-name">Product Name</Label>
            <Input
              id="item-name"
              placeholder="e.g. Greek Yogurt"
              value={name}
              onChange={(e) => setName(e.target.value)}
              autoFocus
            />
          </div>

          <div className="flex flex-col gap-2">
            <Label>Category</Label>
            <Select
              value={category}
              onValueChange={(val) => setCategory(val as FoodCategory)}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {FOOD_CATEGORIES.map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    <span className="flex items-center gap-2">
                      <span>{CATEGORY_EMOJIS[cat]}</span>
                      <span>{CATEGORY_LABELS[cat]}</span>
                    </span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="exp-date">
              Expiration Date
              <span className="ml-1 text-xs text-destructive font-normal">*</span>
            </Label>
            <Input
              id="exp-date"
              type="date"
              value={expiryDate}
              onChange={(e) => setExpiryDate(e.target.value)}
              required
            />
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="exp-time">
              Expiration Time
              <span className="ml-1 text-xs text-muted-foreground font-normal">(optional)</span>
            </Label>
            <Input
              id="exp-time"
              type="time"
              value={expiryTime}
              onChange={(e) => setExpiryTime(e.target.value)}
            />
          </div>

          {/* Only show location picker if user is on "home" tab (no defaultLocation) */}
          {!defaultLocation && (
            <div className="flex flex-col gap-2">
              <Label>Storage Location</Label>
              <Select
                value={location}
                onValueChange={(val) => setLocation(val as StorageLocation)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select location" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="fridge">Fridge</SelectItem>
                  <SelectItem value="freezer">Freezer</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}

          <div className="flex flex-col gap-2">
            <Label htmlFor="notes">
              Notes
              <span className="ml-1 text-xs text-muted-foreground font-normal">(optional)</span>
            </Label>
            <Input
              id="notes"
              placeholder="e.g. Opened yesterday"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </div>

          {error && (
            <p className="text-sm text-destructive">{error}</p>
          )}

          <DialogFooter className="pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                resetForm()
                onOpenChange(false)
              }}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={!isValid || isSubmitting}>
              {isSubmitting ? "Adding..." : "Add Item"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
