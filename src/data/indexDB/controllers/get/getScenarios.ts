import db from "@/data/indexDB/db"

import type { PriceSimulatorDexie } from "@/data/indexDB/db"

import loadScenarios from "@/data/server/load/loadScenarios"

export async function controller(db: PriceSimulatorDexie) {
  let scenarios = await db.scenarios.toArray()

  if ((scenarios?.length ?? 0) < 1) {
    scenarios = await loadScenarios()
  }

  return scenarios
}

export default function getScenarios() {
  return controller(db)
}
