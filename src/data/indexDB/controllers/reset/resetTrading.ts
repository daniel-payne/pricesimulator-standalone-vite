import db from "@/data/indexDB/db"

import type { PriceSimulatorDexie } from "@/data/indexDB/db"

import { controller as addTransaction } from "../add/addTransaction"
import { controller as timerReset } from "../timer/timerReset"
import { controller as getTimer } from "../get/getTimer"
import { DEFAULT_START } from "../../constants/DEFAULT_START"

export async function controller(db: PriceSimulatorDexie) {
  await db.trades.clear()
  await db.margins.clear()
  await db.transactions.clear()

  await timerReset(db, DEFAULT_START)

  const timer = await getTimer(db)

  if (timer?.currentTimestamp != null) {
    await addTransaction(db, 5_000.0, "CLIENT")
  }

  return undefined
}

export default function resetTrading() {
  return controller(db)
}
