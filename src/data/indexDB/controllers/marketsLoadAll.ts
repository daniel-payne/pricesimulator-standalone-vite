import Dexie from "dexie"
import * as Papa from "papaparse"

import db from "@/data/indexDB/db"

import type { PriceSimulatorDexie } from "@/data/indexDB/db"
import type { Market } from "@/data/indexDB/types/Market"
import consoleInfo from "@/utilities/consoleInfo"

export async function controller(db: PriceSimulatorDexie) {
  consoleInfo("marketsLoadAll: controller started")

  consoleInfo("marketsLoadAll: checking db.markets count...")
  const count = await db.markets.count()
  consoleInfo(`marketsLoadAll: current db.markets count = ${count}`)

  if (count > 0) {
    consoleInfo("marketsLoadAll: count > 0, skipping loading markets")
    return
  }

  const url = `/setup/Markets.csv`
  consoleInfo(`marketsLoadAll: fetching markets from ${url}...`)
  const response = await fetch(url, {})
  consoleInfo(`marketsLoadAll: fetch response status = ${response.status}, ok = ${response.ok}`)

  if (response.ok === false) {
    consoleInfo(`marketsLoadAll: fetch failed. status text: ${response.statusText}`)
    return { error: response.statusText }
  }

  const csv = await response.text()
  consoleInfo(`marketsLoadAll: csv text length = ${csv.length}`)

  const json = Papa.parse(csv, { header: true })
  consoleInfo(`marketsLoadAll: parsed csv rows count = ${json.data?.length}`)

  const markets = json.data.filter((item: any) => item?.symbol?.length > 0) as Array<Market>
  consoleInfo(`marketsLoadAll: filtered markets count = ${markets.length}`)

  for (const market of markets) {
    market.market = market.market === "" ? undefined : market.market
    market.country = market.country === "" ? undefined : market.country
    market.description = market.description === "" ? undefined : market.description
    market.code = market.code === "" ? undefined : market.code
    market.priceModifier = market.priceModifier === "" ? undefined : market.priceModifier
    market.priceSize = market.priceSize === "" ? undefined : market.priceSize
    market.priceSpread = market.priceSpread === "" ? undefined : market.priceSpread
    market.priceDecimals = market.priceDecimals === "" ? undefined : market.priceDecimals
    market.contractSize = market.contractSize === "" ? undefined : market.contractSize
    market.contractUnit = market.contractUnit === "" ? undefined : market.contractUnit
    market.contractName = market.contractName === "" ? undefined : market.contractName
    market.baseCurrency = market.baseCurrency === "" ? undefined : market.baseCurrency
    market.quoteCurrency = market.quoteCurrency === "" ? undefined : market.quoteCurrency
    market.baseSymbol = market.baseSymbol === "" ? undefined : market.baseSymbol
  }

  consoleInfo("marketsLoadAll: clearing db.markets table...")
  await db.markets.clear()

  consoleInfo("marketsLoadAll: bulk putting markets into db.markets...")
  await db.markets.bulkPut(markets).catch(Dexie.BulkError, function (e) {
    console.error("marketsLoadAll: loadScenarios Loading Error: ", e)
    consoleInfo(`marketsLoadAll: BulkError, failures = ${e.failures?.length}`)
  })
  consoleInfo("marketsLoadAll: bulkPut completed")

  return markets
}

export default function marketsLoadAll() {
  return controller(db)
}
