import db from "@/data/indexDB/db"

import type { PriceSimulatorDexie } from "@/data/indexDB/db"

const CACHE: Record<string, any> = {}

export async function controller(db: PriceSimulatorDexie, symbol: string, duration: number) {
  if (CACHE[symbol + duration] != null) {
    return CACHE[symbol + duration]
  }

  const parkinsonVolatilities = await db.parkinsonVolatilities.where({ symbol, duration }).first()

  CACHE[symbol + duration] = parkinsonVolatilities?.data

  return parkinsonVolatilities?.data
}

export default function getMarketParkinsonVolatilityValuesForSymbol(symbol: string, duration: number) {
  return controller(db, symbol, duration)
}
