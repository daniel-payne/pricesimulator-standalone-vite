import db from "@/data/indexDB/db"

import type { PriceSimulatorDexie } from "@/data/indexDB/db"

export async function controller(db: PriceSimulatorDexie, symbol: string) {
  const status = await db.statuses.get(symbol)

  return status
}

export default function getStatusForSymbol(symbol: string) {
  return controller(db, symbol)
}
