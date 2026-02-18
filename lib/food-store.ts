import { createClient } from "@/lib/supabase/client"
import type { FoodItem, FoodCategory, StorageLocation } from "./types"

export async function addItem(data: {
  name: string
  location: StorageLocation
  category?: FoodCategory
  entry_date: string
  entry_time?: string | null
  expiry_date?: string | null
  notes?: string | null
}): Promise<FoodItem | null> {
  const supabase = createClient()
  const { data: { user }, error: authError } = await supabase.auth.getUser()
  console.log("[v0] addItem - user:", user?.id, "authError:", authError?.message)
  if (!user) {
    console.log("[v0] addItem - No user found, cannot insert")
    return null
  }

  const insertData = {
    user_id: user.id,
    name: data.name,
    location: data.location,
    category: data.category || "other",
    entry_date: data.entry_date,
    entry_time: data.entry_time || null,
    expiry_date: data.expiry_date || null,
    notes: data.notes || null,
  }
  console.log("[v0] addItem - inserting:", JSON.stringify(insertData))

  const { data: item, error } = await supabase
    .from("food_items")
    .insert(insertData)
    .select()
    .single()

  if (error) {
    console.error("[v0] addItem - Error:", error.message, error.details, error.hint)
    return null
  }
  console.log("[v0] addItem - Success:", item?.id)
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
