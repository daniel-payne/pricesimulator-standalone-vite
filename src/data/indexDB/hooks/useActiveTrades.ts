<<<<<<< HEAD
import compareObjectsByDescending from "@/utilities/compareObjectsByDescending"
import { useLiveQuery } from "dexie-react-hooks"
import db from "../db"

import { TradeStatus } from "../enums/TradeStatus"

export default function useActiveTrades() {
  const data = useLiveQuery(async () => {
    return await db.trades?.where({ status: TradeStatus.Open }).toArray()
  })

  data?.sort(compareObjectsByDescending("no"))

  return data
=======
import { useLiveQuery } from "dexie-react-hooks"

import db from "@/data/indexDB/db"

import type { Trade } from "@/data/indexDB/types/Trade"
import { TradeStatus } from "../enums/TradeStatus"

export default function useActiveTrades(newestFirst = true, limit: number | undefined = undefined): Array<Trade> | undefined {
  const market = useLiveQuery(async () => {
    const collection = await db.trades?.where({ status: TradeStatus.OPEN })

    let array = await collection.sortBy("exitTimestamp")

    if (newestFirst) {
      array = await array.reverse()
    }

    if (limit != null) {
      array = array.slice(0, limit ?? 999999)
    }

    return array
  }, [newestFirst, limit])

  return market
>>>>>>> 371de67 (pre 4 tailwind)
}
