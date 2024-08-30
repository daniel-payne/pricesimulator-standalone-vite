import db from "@/data/indexDB/db"

import type { PriceSimulatorDexie } from "@/data/indexDB/db"

const CACHE: Record<string, any> = {}

export async function controller(db: PriceSimulatorDexie, symbol: string, duration: number) {
  if (CACHE[symbol + duration] != null) {
    return CACHE[symbol + duration]
  }

  const rogersSatchellVolatilities = await db.rogersSatchellVolatilities.where({ symbol, duration }).first()

  CACHE[symbol + duration] = rogersSatchellVolatilities?.data

  return rogersSatchellVolatilities?.data
}

export default function getMarketRogersSatchellVolatilityValuesForSymbol(symbol: string, duration: number) {
  return controller(db, symbol, duration)
}
