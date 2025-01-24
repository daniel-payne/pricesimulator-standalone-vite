import db from "@/data/indexDB/db"

import type { PriceSimulatorDexie } from "@/data/indexDB/db"

const CACHE: Record<string, any> = {}

export async function controller(db: PriceSimulatorDexie, symbol: string) {
  if (CACHE[symbol] != null) {
    return CACHE[symbol].data
  }

  const marketLows = await db.marketLows.get(symbol)

  CACHE[symbol] = marketLows?.data

  return marketLows?.data
}

export default function getMarketLowValuesForSymbol(symbol: string) {
  return controller(db, symbol)
}
