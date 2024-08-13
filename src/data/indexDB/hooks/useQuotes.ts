import { useLiveQuery } from "dexie-react-hooks"

import db from "@/data/indexDB/db"

import type { Quote } from "@/data/indexDB/types/Quote"
import compareObjectsBy from "@/utilities/compareObjectsBy"

export default function useQuotes(): Array<Quote> | undefined {
  const quotes = useLiveQuery(async () => {
    return await db.quotes?.toArray()
  })

  quotes?.sort(compareObjectsBy("symbol"))

  return quotes
}
