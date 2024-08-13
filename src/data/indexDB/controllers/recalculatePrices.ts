import db from "@/data/indexDB/db"

import type { PriceSimulatorDexie } from "@/data/indexDB/db"

import getDataForSymbol from "./getDataForSymbol"

import calculateIndexForTimestamp from "../calculate/calculateIndexForTimestamp"
import calculatePriceForIndex from "../calculate/calculatePriceForIndex"

import Dexie from "dexie"
// import { TradeStatus } from "@/data/indexDB/enums/TradeStatus"
import getStatusForSymbol from "./getStatusForSymbol"
import getTimer from "./getTimer"
import getMarkets from "./getMarkets"
import { Price } from "../types/Price"
// import { ONE_DAY } from "../../constants/ONE_DAY"
// import closeTrade from "../close/closeTrade"

export async function controller(db: PriceSimulatorDexie) {
  const timer = await getTimer()
  const markets = await getMarkets()

  const currentTimestamp = timer?.currentTimestamp

  if (currentTimestamp == null) {
    return undefined
  }

  for await (const market of markets) {
    const symbol = market?.symbol

    const currentPrice = db.pricesCache[symbol]

    const status = await getStatusForSymbol(symbol)

    let newPrice = {
      symbol,
      isMarketActive: false,
      firstActiveTimestamp: status?.firstActiveTimestamp,
    } as Price

    if (status?.firstActiveTimestamp != null && status?.firstActiveTimestamp <= currentTimestamp) {
      const data = await getDataForSymbol(symbol)

      const spread = market?.spread

      const timestamps = data?.timestamps
      const opens = data?.opens
      const highs = data?.highs
      const lows = data?.lows
      const closes = data?.closes

      const hasData = timestamps?.length && opens?.length && highs?.length && lows?.length && closes?.length

      if (hasData) {
        const index = await calculateIndexForTimestamp(timestamps, currentTimestamp, currentPrice?.currentIndex ?? currentPrice?.priorIndex)

        const price = await calculatePriceForIndex(symbol, timestamps, opens, highs, lows, closes, index, spread, currentTimestamp)

        if (price != null) {
          newPrice = price
        }
      }
    }

    db.pricesCache[symbol] = newPrice

    if (newPrice != null) {
      await db.prices.put(newPrice).catch(Dexie.BulkError, function (e) {
        console.error("getPriceForSymbolAndTimestamp Loading Error: " + e.failures.length)
      })
    }
  }
}

export default function recalculatePrices() {
  return controller(db)
}
