import db from "@/data/indexDB/db"

import type { PriceSimulatorDexie } from "@/data/indexDB/db"

import closeTrade from "./closeTrade"

export async function controller(db: PriceSimulatorDexie) {
  const currentMargins = await db.currentMargins.toArray()

  for await (const currentMargin of currentMargins) {
    let shouldClose = false

    if (currentMargin?.durationLeft != null && currentMargin?.durationLeft <= 0) {
      shouldClose = true
    }

    if (currentMargin?.stopLoss != null && currentMargin?.currentProfit <= currentMargin?.stopLoss * -1) {
      shouldClose = true
    }

    if (currentMargin?.takeProfit != null && currentMargin?.currentProfit >= currentMargin?.takeProfit) {
      shouldClose = true
    }

    if (shouldClose) {
      await closeTrade(currentMargin.id)
    }
  }

  return
}

export default function closeExpiringTrades() {
  return controller(db)
}
