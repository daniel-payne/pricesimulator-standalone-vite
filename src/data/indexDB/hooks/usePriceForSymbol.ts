import type { Price } from "../types/Price"
import { useLiveQuery } from "dexie-react-hooks"
import db from "../db"

export default function usePriceForSymbol(symbol: string | undefined | null): Price | undefined {
  const data = useLiveQuery(async () => {
    const result = await db.prices?.where({ symbol }).first()

    return result
  }, [symbol])

  return data
}
