import db from "@/data/indexDB/db"

import { controller as loadMarkets } from "./loadMarkets"
import { controller as loadScenarios } from "./loadScenarios"
import { controller as loadCurrencies } from "./loadCurrencies"
import { controller as loadDataForSymbol } from "./loadDataForSymbol"
import { controller as loadRateForKey } from "./loadRateForKey"
import { controller as addTransaction } from "./addTransaction"
import { controller as recalculateAll } from "./recalculateAll"

import type { PriceSimulatorDexie } from "@/data/indexDB/db"

export async function controller(db: PriceSimulatorDexie) {
  const marketCount = await db.markets.count()
  const scenariosCount = await db.scenarios.count()
  const currencyCount = await db.currencies.count()
  const transactionCount = await db.transactions.count()

  if (scenariosCount < 1) {
    await loadScenarios(db)
  }

  if (marketCount < 1) {
    await loadMarkets(db)
  }

  if (currencyCount < 1) {
    await loadCurrencies(db)
  }

  if (transactionCount < 1) {
    await addTransaction(db, 5000, "USER")
  }

  await loadDataForSymbol(db, "LC.F")
  await loadRateForKey(db, "USD")

  await recalculateAll(db)

  return
}

export default function loadApplication() {
  return controller(db)
}
