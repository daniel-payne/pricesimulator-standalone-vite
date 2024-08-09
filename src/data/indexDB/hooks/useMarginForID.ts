import { useLiveQuery } from "dexie-react-hooks"

import db from "@/data/indexDB/db"

import type { Trade } from "@/data/indexDB/types/Trade"

export default function useMarginForID(id: string | null | undefined): Trade | undefined {
  const trade = useLiveQuery(async () => {
    const margin = await db.margins?.where({ id: id ?? "MISSING" }).first()

    return margin
  }, [id])

  return trade
}
