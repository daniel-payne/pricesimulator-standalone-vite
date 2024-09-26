import db from "../db"

import type { PriceSimulatorDexie } from "../db"
import type { Market } from "../types/Market"

export async function controller(db: PriceSimulatorDexie, newValues: Partial<Market> = {}) {
  const collection = await db.markets.where({ symbol: newValues.symbol })
  const currentMarket = await collection.first()

  if (currentMarket == null) {
    const updatedMarket = newValues as Market
    await db.markets.add(updatedMarket)
  } else {
    const updatedMarket = { ...currentMarket, ...newValues }
    await collection.modify(updatedMarket)
  }
}

export default async function marketUpdate(newValues: Partial<Market> = {}) {
  return await controller(db, newValues)
}
