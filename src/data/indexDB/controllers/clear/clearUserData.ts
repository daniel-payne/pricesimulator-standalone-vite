import db from "@/data/indexDB/db"

import addTransaction from "../add/addTransaction"

import type { PriceSimulatorDexie } from "@/data/indexDB/db"

export async function controller(db: PriceSimulatorDexie) {
  await db.timer.clear()
  await db.balance.clear()

  await db.quotes.clear()

  await db.trades.clear()
  await db.margins.clear()

  await db.transactions.clear()

  await addTransaction(5_000.0, "CLIENT")
}

export default function clearUserData() {
  return controller(db)
}
