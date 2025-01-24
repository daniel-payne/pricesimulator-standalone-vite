import db from "@/data/indexDB/db"

import type { PriceSimulatorDexie } from "@/data/indexDB/db"

const CACHE: Record<string, any> = {}

export async function controller(db: PriceSimulatorDexie, symbol: string, duration: number) {
  if (CACHE[symbol + duration] != null) {
    return CACHE[symbol + duration]
  }

  const yangZhangVolatilities = await db.yangZhangVolatilities.where({ symbol, duration }).first()

  CACHE[symbol + duration] = yangZhangVolatilities?.data

  return yangZhangVolatilities?.data
}

export default function getMarketYangZhangVolatilityValuesForSymbol(symbol: string, duration: number) {
  return controller(db, symbol, duration)
}
