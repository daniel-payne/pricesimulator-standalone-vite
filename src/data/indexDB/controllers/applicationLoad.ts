import db from "@/data/indexDB/db"

import type { PriceSimulatorDexie } from "@/data/indexDB/db"

import { controller as currenciesLoadAll } from "./currenciesLoadAll"
import { controller as marketsLoadAll } from "./marketsLoadAll"
import { controller as scenariosLoadAll } from "./scenariosLoadAll"
import { controller as ohlcLoadFor } from "./ohlcLoadFor"
import { controller as ratesLoadFor } from "./ratesLoadFor"
import consoleInfo from "@/utilities/consoleInfo"

export async function controller(db: PriceSimulatorDexie) {
  consoleInfo("applicationLoad: controller started")

  consoleInfo("applicationLoad: loading currencies...")
  await currenciesLoadAll(db)

  consoleInfo("applicationLoad: loading markets...")
  await marketsLoadAll(db)

  consoleInfo("applicationLoad: loading scenarios...")
  await scenariosLoadAll(db)

  consoleInfo("applicationLoad: reading all scenarios to discover symbols...")
  const scenarios = await db.scenarios.toArray()
  const allSymbols = [
    ...new Set(
      scenarios
        .flatMap((s) => s.symbols?.split(",") ?? [])
        .map((s) => s.trim())
        .filter(Boolean)
    ),
  ]
  consoleInfo(`applicationLoad: found ${allSymbols.length} unique symbol(s): ${allSymbols.join(", ")}`)

  for (const symbol of allSymbols) {
    consoleInfo(`applicationLoad: loading ohlc data for ${symbol}...`)
    await ohlcLoadFor(db, symbol)
  }

  consoleInfo("applicationLoad: loading rates for USD...")
  await ratesLoadFor(db, "USD")

  consoleInfo("applicationLoad: controller finished")
  return
}

export default function applicationLoad() {
  return controller(db)
}
