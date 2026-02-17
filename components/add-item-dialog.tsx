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
import type { StorageLocation } from "@/lib/types"

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
  const [notes, setNotes] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  // If we have a default location (user is on fridge/freezer tab), use it
  const effectiveLocation = defaultLocation || location

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!name || !effectiveLocation) return

    setIsSubmitting(true)
    try {
      const today = new Date().toISOString().split("T")[0]
      await addItem({
        name,
        location: effectiveLocation as StorageLocation,
        entry_date: today,
        entry_time: expiryTime || null,
        expiry_date: expiryDate || null,
        notes: notes || null,
      })

      mutateAll()
      resetForm()
      onOpenChange(false)
    } finally {
      setIsSubmitting(false)
    }
  }

  function resetForm() {
    setName("")
    setExpiryDate("")
    setExpiryTime("")
    setLocation(defaultLocation ?? "")
    setNotes("")
  }

  const isValid = name && effectiveLocation

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
            <Label htmlFor="exp-date">
              Expiration Date
              <span className="ml-1 text-xs text-muted-foreground font-normal">(optional)</span>
            </Label>
            <Input
              id="exp-date"
              type="date"
              value={expiryDate}
              onChange={(e) => setExpiryDate(e.target.value)}
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
