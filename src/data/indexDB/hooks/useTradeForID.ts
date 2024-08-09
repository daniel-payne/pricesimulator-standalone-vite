import { useLiveQuery } from "dexie-react-hooks"

import db from "@/data/indexDB/db"

import type { Trade } from "@/data/indexDB/types/Trade"

export default function useTradeForID(id: string | null | undefined): Trade | undefined {
  const trade = useLiveQuery(async () => {
    const trade = await db.trades?.where({ id: id ?? "MISSING" }).first()

    return trade
  }, [id])

  return trade
}
