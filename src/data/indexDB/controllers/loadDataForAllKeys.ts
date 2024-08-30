import db from "@/data/indexDB/db"

import type { PriceSimulatorDexie } from "@/data/indexDB/db"

import { controller as loadRateForKey } from "./loadRateForKey"

export async function controller(db: PriceSimulatorDexie) {
  const currencies = await db.currencies.toArray()

  for await (const currency of currencies) {
    await loadRateForKey(db, currency.key)
  }

  return
}

export default function loadDataForAllSymbols() {
  return controller(db)
}
