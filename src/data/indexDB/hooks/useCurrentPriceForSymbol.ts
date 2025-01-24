import { useLiveQuery } from "dexie-react-hooks"

import db from "@/data/indexDB/db"

import type { Price } from "../types/Price"

export default function useCurrentPriceForSymbol(symbol: string = "MISSING"): Price | undefined {
  const currentPrice = useLiveQuery(async () => {
    return await db.currentPrices?.where({ symbol }).first()
  })

  return currentPrice
}
