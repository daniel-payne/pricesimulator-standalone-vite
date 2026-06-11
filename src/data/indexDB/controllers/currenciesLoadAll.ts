import Dexie from "dexie"
import * as Papa from "papaparse"

import db from "@/data/indexDB/db"

import type { PriceSimulatorDexie } from "@/data/indexDB/db"
import type { Currency } from "@/data/indexDB/types/Currency"
import consoleInfo from "@/utilities/consoleInfo"

export async function controller(db: PriceSimulatorDexie) {
  consoleInfo("currenciesLoadAll: controller started")

  consoleInfo("currenciesLoadAll: checking db.currencies count...")
  const count = await db.currencies.count()
  consoleInfo(`currenciesLoadAll: current db.currencies count = ${count}`)

  if (count > 0) {
    consoleInfo("currenciesLoadAll: count > 0, skipping loading currencies")
    return
  }

  const url = `/setup/Currencies.csv`
  consoleInfo(`currenciesLoadAll: fetching currencies from ${url}...`)
  const response = await fetch(url, {})
  consoleInfo(`currenciesLoadAll: fetch response status = ${response.status}, ok = ${response.ok}`)

  if (response.ok === false) {
    consoleInfo(`currenciesLoadAll: fetch failed. status text: ${response.statusText}`)
    return { error: response.statusText }
  }

  const csv = await response.text()
  consoleInfo(`currenciesLoadAll: csv text length = ${csv.length}`)

  const json = Papa.parse(csv, { header: true })
  consoleInfo(`currenciesLoadAll: parsed csv rows count = ${json.data?.length}`)

  const currencies = json.data.filter((item: any) => item?.code?.length > 0) as Array<Currency>
  consoleInfo(`currenciesLoadAll: filtered currencies count = ${currencies.length}`)

  consoleInfo("currenciesLoadAll: clearing db.currencies table...")
  await db.currencies.clear()

  consoleInfo("currenciesLoadAll: bulk putting currencies into db.currencies...")
  await db.currencies.bulkPut(currencies).catch(Dexie.BulkError, function (e) {
    console.error("currenciesLoadAll: loadCurrencies Loading Error: ", e)
    consoleInfo(`currenciesLoadAll: BulkError, failures = ${e.failures?.length}`)
  })
  consoleInfo("currenciesLoadAll: bulkPut completed")

  return currencies
}

export default function currenciesLoadAll() {
  return controller(db)
}
