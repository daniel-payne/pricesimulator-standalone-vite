import { useLiveQuery } from "dexie-react-hooks"

import db from "@/data/indexDB/db"

import compareObjectsBy from "@/utilities/compareObjectsBy"
import type { Volatility } from "../types/Volatility"

export default function useCurrentVolatilities(): Array<Volatility> | undefined {
  const currentVolatilities = useLiveQuery(async () => {
    return await db.currentVolatilities?.toArray()
  })

  currentVolatilities?.sort(compareObjectsBy("symbol"))

  return currentVolatilities
}
