import db from "@/data/indexDB/db"
import Dexie from "dexie"

export default async function loadScenarios() {
  console.info("loadScenarios from server")

  const response = await fetch(`http://localhost:4000/rest/scenarios`, { cache: "no-cache" })

  if (response.ok === false) {
    return { error: response.statusText }
  }

  const scenarios = await response.json()

  await db.scenarios.bulkPut(scenarios).catch(Dexie.BulkError, function (e) {
    console.error("loadScenarios Loading Error: " + e.failures.length)
  })

  return scenarios
}
