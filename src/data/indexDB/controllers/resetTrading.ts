import db from "@/data/indexDB/db"

import type { PriceSimulatorDexie } from "@/data/indexDB/db"

import { controller as timerReset } from "./timerReset"
import { controller as clearUserData } from "./clearUserData"

export async function controller(db: PriceSimulatorDexie) {
  clearUserData(db)
  timerReset(db)

  return
}

export default function resetTrading() {
  return controller(db)
}
