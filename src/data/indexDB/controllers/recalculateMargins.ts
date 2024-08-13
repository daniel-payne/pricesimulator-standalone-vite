import db from "@/data/indexDB/db"

import type { PriceSimulatorDexie } from "@/data/indexDB/db"
import { TradeStatus } from "../enums/TradeStatus"
import closeTrade from "./closeTrade"
import Dexie from "dexie"
import getTimer from "./getTimer"
import getMarketForSymbol from "./getMarketForSymbol"
import { ONE_DAY } from "../constants/ONE_DAY"

export async function controller(db: PriceSimulatorDexie) {
  const activeTrades = await db.trades?.where({ status: TradeStatus.Open }).toArray()

  const timer = await getTimer()

  for await (const activeTrade of activeTrades) {
    const symbol = activeTrade.symbol
    const price = db.pricesCache[symbol]

    const market = await getMarketForSymbol(symbol)

    const currentTimestamp = timer?.currentTimestamp

    if (currentTimestamp != null && price != null) {
      const currentPrice = activeTrade.direction === "CALL" ? price.priorClosingAsk : price.priorClosingBid

      const currentDifference = activeTrade.direction === "CALL" ? currentPrice - activeTrade.entryPrice : activeTrade.entryPrice - currentPrice

      const currentPercent = currentDifference / activeTrade.entryPrice

      const currentValue = ((currentPrice * (market?.priceModifier ?? 1)) / (market?.priceSize ?? 1)) * activeTrade.amount

      const currentProfit = activeTrade.direction === "CALL" ? currentValue - activeTrade.entryValue : activeTrade.entryValue - currentValue

      const durationLeft = Math.floor((activeTrade.expiryTimestamp - currentTimestamp) / ONE_DAY)

      const newMargin = {
        id: activeTrade.id,
        symbol,
        status: TradeStatus.Open,
        currentTimestamp,
        currentPrice,
        currentDifference,
        currentPercent,
        currentValue,
        currentProfit,
        durationLeft,
      }

      await db.margins.put(newMargin).catch(Dexie.BulkError, function (e) {
        console.error("getPriceForSymbolAndTimestamp Pricing Error: " + e.failures.length)
      })

      if (durationLeft <= 1) {
        await closeTrade(activeTrade.id)
      }
    }
  }
}

export default function updateMargins() {
  return controller(db)
}
