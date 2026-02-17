import useSWR, { mutate as globalMutate } from "swr"
import {
  getActiveItems,
  getFinishedItems,
  cleanupExpiredFinished,
} from "@/lib/food-store"
import type { StorageLocation } from "@/lib/types"

const ITEMS_KEY_PREFIX = "food-items"

export function useFridgeItems() {
  return useSWR(`${ITEMS_KEY_PREFIX}-fridge`, () => getActiveItems("fridge"), {
    refreshInterval: 60000,
  })
}

export function useFreezerItems() {
  return useSWR(
    `${ITEMS_KEY_PREFIX}-freezer`,
    () => getActiveItems("freezer"),
    { refreshInterval: 60000 }
  )
}

export function useFinishedItems() {
  return useSWR(
    `${ITEMS_KEY_PREFIX}-finished`,
    () => {
      cleanupExpiredFinished()
      return getFinishedItems()
    },
    { refreshInterval: 60000 }
  )
}

export function useLocationItems(location: StorageLocation) {
  return useSWR(
    `${ITEMS_KEY_PREFIX}-${location}`,
    () => getActiveItems(location),
    { refreshInterval: 60000 }
  )
}

export function mutateAll() {
  globalMutate(`${ITEMS_KEY_PREFIX}-fridge`)
  globalMutate(`${ITEMS_KEY_PREFIX}-freezer`)
  globalMutate(`${ITEMS_KEY_PREFIX}-finished`)
}
