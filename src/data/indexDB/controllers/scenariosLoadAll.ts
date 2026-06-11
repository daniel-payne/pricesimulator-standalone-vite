import Dexie from "dexie"
import * as Papa from "papaparse"

import db from "@/data/indexDB/db"

import type { PriceSimulatorDexie } from "@/data/indexDB/db"
import type { Scenario } from "@/data/indexDB/types/Scenario"
import consoleInfo from "@/utilities/consoleInfo"

export async function controller(db: PriceSimulatorDexie) {
  consoleInfo("scenariosLoadAll: controller started")

  consoleInfo("scenariosLoadAll: checking db.scenarios count...")
  const count = await db.scenarios.count()
  consoleInfo(`scenariosLoadAll: current db.scenarios count = ${count}`)

  if (count > 0) {
    consoleInfo("scenariosLoadAll: count > 0, skipping loading scenarios")
    return
  }

  const url = `/setup/Scenarios.csv`
  consoleInfo(`scenariosLoadAll: fetching scenarios from ${url}...`)
  const response = await fetch(url, {})
  consoleInfo(`scenariosLoadAll: fetch response status = ${response.status}, ok = ${response.ok}`)

  if (response.ok === false) {
    consoleInfo(`scenariosLoadAll: fetch failed. status text: ${response.statusText}`)
    return { error: response.statusText }
  }

  const csv = await response.text()
  consoleInfo(`scenariosLoadAll: csv text length = ${csv.length}`)

  const json = Papa.parse(csv, { header: true })
  consoleInfo(`scenariosLoadAll: parsed csv rows count = ${json.data?.length}`)

  const scenarios = json.data.filter((item: any) => item?.ref?.length > 0) as Array<Scenario>
  consoleInfo(`scenariosLoadAll: filtered scenarios count = ${scenarios.length}`)

  consoleInfo("scenariosLoadAll: clearing db.scenarios table...")
  await db.scenarios.clear()

  consoleInfo("scenariosLoadAll: bulk putting scenarios into db.scenarios...")
  await db.scenarios.bulkPut(scenarios).catch(Dexie.BulkError, function (e) {
    console.error("scenariosLoadAll: loadScenarios Loading Error: ", e)
    consoleInfo(`scenariosLoadAll: BulkError, failures = ${e.failures?.length}`)
  })
  consoleInfo("scenariosLoadAll: bulkPut completed")

  return scenarios
}

export default function scenariosLoadAll() {
  return controller(db)
}
