import type { FoodItem, StorageLocation, FoodCategory } from "./types"

const STORAGE_KEY = "food-expiry-items"

function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`
}

export function getItems(): FoodItem[] {
  if (typeof window === "undefined") return []
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    return JSON.parse(raw) as FoodItem[]
  } catch {
    return []
  }
}

function saveItems(items: FoodItem[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
}

export function addItem(data: {
  name: string
  category: FoodCategory
  expirationDate: string
  location: StorageLocation
}): FoodItem {
  const items = getItems()
  const newItem: FoodItem = {
    id: generateId(),
    ...data,
  }
  items.push(newItem)
  saveItems(items)
  return newItem
}

export function markAsFinished(id: string): void {
  const items = getItems()
  const idx = items.findIndex((item) => item.id === id)
  if (idx !== -1) {
    items[idx].finishedAt = new Date().toISOString()
    saveItems(items)
  }
}

export function deleteItem(id: string): void {
  const items = getItems().filter((item) => item.id !== id)
  saveItems(items)
}

export function restoreItem(id: string): void {
  const items = getItems()
  const idx = items.findIndex((item) => item.id === id)
  if (idx !== -1) {
    delete items[idx].finishedAt
    saveItems(items)
  }
}

export function cleanupExpiredFinished(): void {
  const now = new Date()
  const items = getItems().filter((item) => {
    if (!item.finishedAt) return true
    const finishedAt = new Date(item.finishedAt)
    const hoursSinceFinished =
      (now.getTime() - finishedAt.getTime()) / (1000 * 60 * 60)
    return hoursSinceFinished < 24
  })
  saveItems(items)
}

export function getActiveItems(location: StorageLocation): FoodItem[] {
  return getItems()
    .filter((item) => item.location === location && !item.finishedAt)
    .sort(
      (a, b) =>
        new Date(a.expirationDate).getTime() -
        new Date(b.expirationDate).getTime()
    )
}

export function getFinishedItems(): FoodItem[] {
  return getItems()
    .filter((item) => !!item.finishedAt)
    .sort(
      (a, b) =>
        new Date(b.finishedAt!).getTime() - new Date(a.finishedAt!).getTime()
    )
}

export function getExpirationStatus(
  expirationDate: string
): "expired" | "warning" | "ok" {
  const now = new Date()
  const expDate = new Date(expirationDate)
  const hoursUntilExpiry =
    (expDate.getTime() - now.getTime()) / (1000 * 60 * 60)

  if (hoursUntilExpiry <= 0) return "expired"
  if (hoursUntilExpiry <= 24) return "warning"
  return "ok"
}

export function getDaysLeft(expirationDate: string): number {
  const now = new Date()
  const expDate = new Date(expirationDate)
  return Math.ceil(
    (expDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
  )
}

export function getExpiringCount(location?: StorageLocation): number {
  const items = getItems().filter((item) => !item.finishedAt)
  const filtered = location
    ? items.filter((item) => item.location === location)
    : items
  return filtered.filter((item) => {
    const status = getExpirationStatus(item.expirationDate)
    return status === "warning" || status === "expired"
  }).length
}
