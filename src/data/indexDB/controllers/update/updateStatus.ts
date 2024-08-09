import db from "../../db"

import type { PriceSimulatorDexie } from "../../db"

import type { Status } from "../../types/Status"

export async function controller(db: PriceSimulatorDexie, symbol: string, newValues: Status = {}) {
  const currentStatus = await db.statuses.get(symbol)

  if (currentStatus == null) {
    await db.statuses.add({ symbol, ...newValues })
  } else {
    await db.statuses.update(symbol, { symbol, ...newValues })
  }
}

export default async function updateStatus(symbol: string, newValues: Status = {}) {
  return await controller(db, symbol, newValues)
}
