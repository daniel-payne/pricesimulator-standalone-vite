import { useLiveQuery } from "dexie-react-hooks"

import db from "@/data/indexDB/db"

import type { Price } from "@/data/indexDB/types/Price"
import compareObjectsBy from "@/utilities/compareObjectsBy"

export default function usePrices(): Array<Price> | undefined {
  const prices = useLiveQuery(async () => {
    return await db.prices?.toArray()
  })

  prices?.sort(compareObjectsBy("symbol"))

  return prices
}
