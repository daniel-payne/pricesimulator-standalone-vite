import { useLiveQuery } from "dexie-react-hooks"

import db from "@/data/indexDB/db"

import type { Quote } from "@/data/indexDB/types/Quote"

const DEFAULT_QUOTE = {}

export default function useQuoteForSymbol(symbol: string | undefined | null = "NO-MATCH"): Quote | undefined {
  const data = useLiveQuery(async () => {
    let quote = await db.quotes?.where({ symbol }).first()

    if (quote == null) {
      quote = { ...DEFAULT_QUOTE, symbol }
    }

    return quote
  }, [symbol])

  return data
}
