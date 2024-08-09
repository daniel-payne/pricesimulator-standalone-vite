import type { Data } from "../types/Data"
import { useLiveQuery } from "dexie-react-hooks"
import db from "../db"

export default function useDataForSymbol(symbol: string | undefined | null): Data | undefined {
  const data = useLiveQuery(async () => {
    const result = await db.data?.where({ symbol }).first()

    return result
  }, [symbol])

  return data
}
