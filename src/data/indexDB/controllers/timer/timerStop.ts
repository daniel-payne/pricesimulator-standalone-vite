import db from "../../db"

import updateTimer from "../update/updateTimer"

import type { PriceSimulatorDexie } from "../../db"

export async function controller(db: PriceSimulatorDexie) {
  if (db.timeout != null) {
    window.clearTimeout(db.timeout)
  }
  updateTimer({ isTimerActive: false })
}

export default function timerStop() {
  return controller(db)
}
