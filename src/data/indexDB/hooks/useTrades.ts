import { useLiveQuery } from "dexie-react-hooks"

import db from "@/data/indexDB/db"

import type { Trade } from "@/data/indexDB/types/Trade"

export default function useTrades(): Array<Trade> | undefined {
  const trades = useLiveQuery(async () => {
    return await db.trades?.toArray()
  })

  return trades
}
