import db from "@/data/indexDB/db"

import type { PriceSimulatorDexie } from "@/data/indexDB/db"

export function controller(db: PriceSimulatorDexie, symbol: string) {
  return db.dataCache[symbol]
}

export default function readDataForSymbol(symbol: string) {
  return controller(db, symbol)
}
