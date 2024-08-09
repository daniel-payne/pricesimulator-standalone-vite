import { useLiveQuery } from "dexie-react-hooks"

import db from "@/data/indexDB/db"

import type { Quote } from "@/data/indexDB/types/Quote"

export default function useQuotes(): Array<Quote> | undefined {
  const quotes = useLiveQuery(async () => {
    return await db.quotes?.toArray()
  })

  return quotes
}
