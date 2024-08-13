import db from "@/data/indexDB/db"

import { ScenarioSpeed } from "@/data/indexDB/enums/ScenarioSpeed"

import { DEFAULT_START } from "@/data/indexDB/constants/DEFAULT_START"
import { ONE_DAY } from "@/data/indexDB/constants/ONE_DAY"

import updateTimer from "@/data/indexDB/controllers/updateTimer"

import type { PriceSimulatorDexie } from "@/data/indexDB/db"

import getTimer from "./getTimer"

import recalculatePrices from "./recalculatePrices"
import recalculateMargins from "./recalculateMargins"
// import updateStatus from "../update/updateStatus"

export async function controller(db: PriceSimulatorDexie, takeControl: boolean) {
  const timer = await getTimer()

  db.transaction("rw", ["timer", "data", "markets", "prices", "trades", "margins", "statuses", "transactions"], async () => {
    const currentDay = timer?.currentDay

    const isOwner = takeControl === true ? true : timer?.id === db.id

    let isTimerActive = takeControl === true ? true : timer?.isTimerActive === true

    if (isOwner && isTimerActive && currentDay != null) {
      const oldDate = new Date(currentDay ?? DEFAULT_START)
      const newDate = new Date(oldDate.getTime() + ONE_DAY)

      const newDay = newDate.toISOString().substring(0, 10)
      const newTimestamp = newDate.getTime()

      if (takeControl === true) {
        isTimerActive = false

        await updateTimer({ id: db.id, currentDay: newDay, currentTimestamp: newTimestamp, isTimerActive })
      } else {
        await updateTimer({ currentDay: newDay, currentTimestamp: newTimestamp })
      }

      await recalculatePrices()

      await recalculateMargins()
    }
  })
    .then(async () => {
      const { speed, isTimerActive } = timer ?? {}

      if (isTimerActive === true) {
        db.timeout = window.setTimeout(() => {
          controller(db, takeControl)
        }, speed ?? ScenarioSpeed.Slow)
      }
    })
    .catch((err) => {
      console.error(err.stack)
    })
}

export default function timerNextDay(takeControl = false) {
  return controller(db, takeControl)
}
