import { createClient } from "@/lib/supabase/client"
import type { FoodItem, StorageLocation } from "./types"

export async function addItem(data: {
  name: string
  location: StorageLocation
  entry_date: string
  entry_time?: string | null
  expiry_date?: string | null
  notes?: string | null
}): Promise<FoodItem | null> {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  const { data: item, error } = await supabase
    .from("food_items")
    .insert({
      user_id: user.id,
      name: data.name,
      location: data.location,
      entry_date: data.entry_date,
      entry_time: data.entry_time || null,
      expiry_date: data.expiry_date || null,
      notes: data.notes || null,
    })
    .select()
    .single()

  if (error) {
    console.error("Error adding item:", error)
    return null
  }
  return item
}

export async function markAsFinished(id: string): Promise<void> {
  const supabase = createClient()
  const { error } = await supabase
    .from("food_items")
    .update({ is_finished: true })
    .eq("id", id)

  if (error) console.error("Error marking item as finished:", error)
}

export async function deleteItem(id: string): Promise<void> {
  const supabase = createClient()
  const { error } = await supabase
    .from("food_items")
    .delete()
    .eq("id", id)

  if (error) console.error("Error deleting item:", error)
}

export async function restoreItem(id: string): Promise<void> {
  const supabase = createClient()
  const { error } = await supabase
    .from("food_items")
    .update({ is_finished: false })
    .eq("id", id)

  if (error) console.error("Error restoring item:", error)
}

export async function getActiveItems(location: StorageLocation): Promise<FoodItem[]> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from("food_items")
    .select("*")
    .eq("location", location)
    .eq("is_finished", false)
    .order("expiry_date", { ascending: true, nullsFirst: false })

  if (error) {
    console.error("Error fetching active items:", error)
    return []
  }
  return data || []
}

export async function getFinishedItems(): Promise<FoodItem[]> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from("food_items")
    .select("*")
    .eq("is_finished", true)
    .order("created_at", { ascending: false })

  if (error) {
    console.error("Error fetching finished items:", error)
    return []
  }
  return data || []
}

export async function getAllActiveItems(): Promise<FoodItem[]> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from("food_items")
    .select("*")
    .eq("is_finished", false)
    .order("expiry_date", { ascending: true, nullsFirst: false })

  if (error) {
    console.error("Error fetching all active items:", error)
    return []
  }
  return data || []
}

export function getExpirationStatus(
  expiryDate: string | null
): "expired" | "warning" | "ok" | "none" {
  if (!expiryDate) return "none"
  const now = new Date()
  const expDate = new Date(expiryDate)
  const hoursUntilExpiry =
    (expDate.getTime() - now.getTime()) / (1000 * 60 * 60)

  if (hoursUntilExpiry <= 0) return "expired"
  if (hoursUntilExpiry <= 24) return "warning"
  return "ok"
}

export function getDaysLeft(expiryDate: string | null): number | null {
  if (!expiryDate) return null
  const now = new Date()
  const expDate = new Date(expiryDate)
  return Math.ceil(
    (expDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
  )
}
