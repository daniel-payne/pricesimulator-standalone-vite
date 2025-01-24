import db from "@/data/indexDB/db"

import type { PriceSimulatorDexie } from "@/data/indexDB/db"

import getTimer from "./getTimer"

import getCurrencyRateValuesForSymbol from "./getCurrencyRateValuesForKey"
import getRateSummaries from "./getRateSummaries"
import { Rate } from "../types/Rate"
import extractRateForIndex from "../calculate/extractRateForIndex"

export async function controller(db: PriceSimulatorDexie) {
  const timer = await getTimer()
  const rateSummaries = await getRateSummaries()

  const currentIndex = timer?.currentIndex

  if (currentIndex == null) {
    return undefined
  }

  await db.currentRates.clear()

  for await (const rateSummary of rateSummaries) {
    const key = rateSummary.key

    if (key != null) {
      const rates = await getCurrencyRateValuesForSymbol(key)

      const currentRate = extractRateForIndex(currentIndex, rates, rateSummary) as Rate

      if (currentRate != null) {
        await db.currentRates.put(currentRate)
      }
    }
  }

  return db
}

export default function recalculateCurrentRates() {
  return controller(db)
}
