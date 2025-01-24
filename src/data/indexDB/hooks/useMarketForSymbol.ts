import { useLiveQuery } from "dexie-react-hooks"

import db from "@/data/indexDB/db"

import type { Market } from "@/data/indexDB/types/Market"

export default function useMarketForSymbol(symbol: string | undefined | null = "NO-MATCH"): Market | undefined {
  const market = useLiveQuery(async () => {
    return await db.markets?.where({ symbol }).first()
  }, [symbol])

  return market
}
