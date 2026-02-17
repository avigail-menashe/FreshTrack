export type StorageLocation = "fridge" | "freezer"

export type FoodCategory =
  | "dairy"
  | "vegetables"
  | "fruits"
  | "meat"
  | "fish"
  | "frozen"
  | "beverages"
  | "grains"
  | "snacks"
  | "condiments"
  | "other"

export interface FoodItem {
  id: string
  user_id: string
  name: string
  location: StorageLocation
  entry_date: string
  entry_time: string | null
  expiry_date: string | null
  notes: string | null
  is_finished: boolean
  created_at: string
}

export const CATEGORY_LABELS: Record<FoodCategory, string> = {
  dairy: "Dairy",
  vegetables: "Vegetables",
  fruits: "Fruits",
  meat: "Meat",
  fish: "Fish",
  frozen: "Frozen",
  beverages: "Beverages",
  grains: "Grains",
  snacks: "Snacks",
  condiments: "Condiments",
  other: "Other",
}

export const CATEGORY_EMOJIS: Record<FoodCategory, string> = {
  dairy: "\uD83E\uDDC0",
  vegetables: "\uD83E\uDD66",
  fruits: "\uD83C\uDF53",
  meat: "\uD83E\uDD69",
  fish: "\uD83D\uDC1F",
  frozen: "\u2744\uFE0F",
  beverages: "\uD83E\uDDC3",
  grains: "\uD83C\uDF3E",
  snacks: "\uD83C\uDF6A",
  condiments: "\uD83E\uDED9",
  other: "\uD83D\uDCE6",
}

export const CATEGORY_BG_COLORS: Record<FoodCategory, string> = {
  dairy: "bg-amber-100",
  vegetables: "bg-emerald-100",
  fruits: "bg-rose-100",
  meat: "bg-red-100",
  fish: "bg-sky-100",
  frozen: "bg-blue-100",
  beverages: "bg-cyan-100",
  grains: "bg-orange-100",
  snacks: "bg-yellow-100",
  condiments: "bg-lime-100",
  other: "bg-stone-100",
}
