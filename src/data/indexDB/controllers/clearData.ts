import db from "@/data/indexDB/db"

import type { PriceSimulatorDexie } from "@/data/indexDB/db"

export async function controller(db: PriceSimulatorDexie) {
  await db.timer.clear()
  await db.balance.clear()

  await db.scenarios.clear()
  await db.markets.clear()

  await db.statuses.clear()
  await db.data.clear()
  await db.prices.clear()

  await db.quotes.clear()

  await db.trades.clear()
  await db.margins.clear()

  await db.transactions.clear()

  db.dataCache = {}
  db.pricesCache = {}
}

export default function clearData() {
  return controller(db)
}
