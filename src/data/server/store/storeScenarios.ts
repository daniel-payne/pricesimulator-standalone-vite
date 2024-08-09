import Dexie from "dexie"

import db from "@/data/indexDB/db"

export default async function storeScenarios(scenarios: any) {
  await db.scenarios.put(scenarios).catch(Dexie.BulkError, function (e) {
    console.error("Store Scenarios Error: " + e.failures.length)
  })

  return scenarios
}
