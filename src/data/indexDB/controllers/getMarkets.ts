import db from "@/data/indexDB/db"

import type { PriceSimulatorDexie } from "@/data/indexDB/db"

import loadMarkets from "@/data/server/load/loadMarkets"

export async function controller(db: PriceSimulatorDexie) {
  let markets = await db.markets.toArray()

  if ((markets?.length ?? 0) < 1) {
    markets = await loadMarkets()
  }

  return markets
}

export default function getMarkets() {
  return controller(db)
}
