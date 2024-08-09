import db from "@/data/indexDB/db"

import type { PriceSimulatorDexie } from "@/data/indexDB/db"

export async function controller(db: PriceSimulatorDexie, symbol: string) {
  const quote = await db.quotes?.where({ symbol }).first()

  return quote ? null : quote
}

export default function openTrade(symbol: string) {
  return controller(db, symbol)
}
