import { useLiveQuery } from "dexie-react-hooks"

import db from "@/data/indexDB/db"

import type { Trade } from "@/data/indexDB/types/Trade"
import { TradeStatus } from "../enums/TradeStatus"

export default function useActiveTradeForSymbol(symbol: string | undefined | null = "NO-MATCH"): Trade | null | undefined {
  const trade = useLiveQuery(async () => {
    const data = await db.trades?.where({ symbol, status: TradeStatus.OPEN }).first()

    return data
  }, [symbol])

  return trade
}
