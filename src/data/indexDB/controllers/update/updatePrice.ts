import db from "@/data/indexDB/db"

import type { PriceSimulatorDexie } from "@/data/indexDB/db"

import getMarketForSymbol from "../get/getMarketForSymbol"
import getDataForSymbol from "../get/getDataForSymbol"

import calculateIndexForTimestamp from "../../calculate/calculateIndexForTimestamp"
import calculatePriceForIndex from "../../calculate/calculatePriceForIndex"

import Dexie from "dexie"
import { TradeStatus } from "@/data/indexDB/enums/TradeStatus"
import getStatusForSymbol from "../get/getStatusForSymbol"

export async function controller(db: PriceSimulatorDexie, symbol: string | undefined, timestamp: number | undefined) {
  if (symbol == null || timestamp == null) {
    return undefined
  }

  const currentPrice = db.pricesCache[symbol]

  if (currentPrice?.timestamp === timestamp) {
    return currentPrice
  }

  const market = await getMarketForSymbol(symbol)
  const status = await getStatusForSymbol(symbol)

  const spread = market?.spread

  const data = await getDataForSymbol(symbol)

  const timestamps = data?.timestamps
  const opens = data?.opens
  const highs = data?.highs
  const lows = data?.lows
  const closes = data?.closes

  if (status?.firstActiveTimestamp == null || timestamp == null || status?.firstActiveTimestamp < timestamp) {
    return undefined
  }

  if (timestamps != null) {
    const index = await calculateIndexForTimestamp(timestamps, timestamp, currentPrice?.currentIndex ?? currentPrice?.priorIndex)

    const price = await calculatePriceForIndex(symbol, timestamps, opens, highs, lows, closes, index, spread, timestamp)

    db.pricesCache[symbol] = price

    if (price != null) {
      await db.prices.put(price).catch(Dexie.BulkError, function (e) {
        console.error("getPriceForSymbolAndTimestamp Loading Error: " + e.failures.length)
      })

      const activeTrade = await db.trades?.where({ symbol, status: TradeStatus.OPEN }).first()

      if (activeTrade != null) {
        const currentPrice = activeTrade.direction === "CALL" ? price.priorClosingBid : price.priorClosingAsk

        const currentDifference = activeTrade.direction === "CALL" ? currentPrice - activeTrade.entryPrice : activeTrade.entryPrice - currentPrice

        const currentPercent = currentDifference / activeTrade.entryPrice

        const currentValue = currentPrice * (market?.dollarModifier ?? 1) * activeTrade.amount

        const currentProfit = activeTrade.direction === "CALL" ? currentValue - activeTrade.entryValue : activeTrade.entryValue - currentValue

        const newMargin = {
          id: activeTrade.id,
          symbol: activeTrade.symbol,
          status: TradeStatus.OPEN,
          currentTimestamp: timestamp,
          currentPrice,
          currentDifference,
          currentPercent,
          currentValue,
          currentProfit,
        }

        await db.margins.put(newMargin).catch(Dexie.BulkError, function (e) {
          console.error("getPriceForSymbolAndTimestamp Pricing Error: " + e.failures.length)
        })
      }

      return price
    }
  }
}

export default function updatePrice(symbol: string, timestamp: number) {
  return controller(db, symbol, timestamp)
}
