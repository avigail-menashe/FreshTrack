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
import type { FoodCategory, StorageLocation } from "@/lib/types"
import { CATEGORY_LABELS, CATEGORY_EMOJIS } from "@/lib/types"

interface AddItemDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  defaultLocation?: StorageLocation
}

export function AddItemDialog({ open, onOpenChange, defaultLocation }: AddItemDialogProps) {
  const [name, setName] = useState("")
  const [category, setCategory] = useState<FoodCategory | "">("")
  const [expirationDate, setExpirationDate] = useState("")
  const [location, setLocation] = useState<StorageLocation | "">(defaultLocation ?? "")

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!name || !category || !expirationDate || !location) return

    addItem({
      name,
      category: category as FoodCategory,
      expirationDate: new Date(expirationDate).toISOString(),
      location: location as StorageLocation,
    })

    mutateAll()
    resetForm()
    onOpenChange(false)
  }

  function resetForm() {
    setName("")
    setCategory("")
    setExpirationDate("")
    setLocation(defaultLocation ?? "")
  }

  const isValid = name && category && expirationDate && location

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add New Item</DialogTitle>
          <DialogDescription>
            Track a new item in your fridge or freezer.
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
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                {(Object.keys(CATEGORY_LABELS) as FoodCategory[]).map(
                  (key) => (
                    <SelectItem key={key} value={key}>
                      <span className="inline-flex items-center gap-2">
                        <span>{CATEGORY_EMOJIS[key]}</span>
                        <span>{CATEGORY_LABELS[key]}</span>
                      </span>
                    </SelectItem>
                  )
                )}
              </SelectContent>
            </Select>
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="exp-date">Expiration Date & Time</Label>
            <Input
              id="exp-date"
              type="datetime-local"
              value={expirationDate}
              onChange={(e) => setExpirationDate(e.target.value)}
            />
          </div>

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
            <Button type="submit" disabled={!isValid}>
              Add Item
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
