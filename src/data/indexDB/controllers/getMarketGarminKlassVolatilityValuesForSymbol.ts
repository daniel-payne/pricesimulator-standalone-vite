import db from "@/data/indexDB/db"

import type { PriceSimulatorDexie } from "@/data/indexDB/db"

const CACHE: Record<string, any> = {}

export async function controller(db: PriceSimulatorDexie, symbol: string, duration: number) {
  if (CACHE[symbol + duration] != null) {
    return CACHE[symbol + duration]
  }

  const garminKlassVolatilities = await db.garminKlassVolatilities.where({ symbol, duration }).first()

  CACHE[symbol + duration] = garminKlassVolatilities?.data

  return garminKlassVolatilities?.data
}

export default function getMarketGarminKlassVolatilityValuesForSymbol(symbol: string, duration: number) {
  return controller(db, symbol, duration)
}
