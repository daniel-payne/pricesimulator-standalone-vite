import db from "../../db"

import updateTimer from "../update/updateTimer"

import type { PriceSimulatorDexie } from "../../db"
import timerNextDay from "./timerNextDay"
import { DEFAULT_START } from "../../constants/DEFAULT_START"

export async function controller(db: PriceSimulatorDexie, day: string) {
  if (db.timeout != null) {
    window.clearTimeout(db.timeout)
  }

  await updateTimer({ isTimerActive: false, currentDay: day, currentTimestamp: new Date(day).getTime() })

  await timerNextDay(true)
}

export default function timerReset(day: string = DEFAULT_START) {
  return controller(db, day)
}
