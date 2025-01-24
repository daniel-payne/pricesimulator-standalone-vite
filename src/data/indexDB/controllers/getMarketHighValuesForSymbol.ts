import db from "@/data/indexDB/db"

import type { PriceSimulatorDexie } from "@/data/indexDB/db"

const CACHE: Record<string, any> = {}

export async function controller(db: PriceSimulatorDexie, symbol: string) {
  if (CACHE[symbol] != null) {
    return CACHE[symbol].data
  }

  const marketHighs = await db.marketHighs.get(symbol)

  CACHE[symbol] = marketHighs?.data

  return marketHighs?.data
}

export default function getMarketHighValuesForSymbol(symbol: string) {
  return controller(db, symbol)
}
