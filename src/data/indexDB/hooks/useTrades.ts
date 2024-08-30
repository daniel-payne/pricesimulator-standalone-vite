import { useLiveQuery } from "dexie-react-hooks"

import db from "@/data/indexDB/db"

import type { Trade } from "@/data/indexDB/types/Trade"
import compareObjectsBy from "@/utilities/compareObjectsBy"

export default function useTrades(): Array<Trade> | undefined {
  const trades = useLiveQuery(async () => {
    return await db.trades?.toArray()
  })

  trades?.sort(compareObjectsBy("entryTimestamp"))

  return trades
}
