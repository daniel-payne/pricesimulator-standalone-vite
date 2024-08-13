import db from "@/data/indexDB/db"

import type { PriceSimulatorDexie } from "@/data/indexDB/db"
import { TradeDirection } from "../enums/TradeDirection"

export async function controller(db: PriceSimulatorDexie, symbol: string, tradeDirection: TradeDirection) {
  const price = await db.prices?.where({ symbol })?.first()

  const isClosingPrice = Math.random() > 0.9

  if (price != null) {
    let tradePrice

    if (isClosingPrice) {
      if (tradeDirection === TradeDirection.Call) {
        tradePrice = price.currentClosingAsk
      } else {
        tradePrice = price.currentClosingBid
      }
    } else {
      if (tradeDirection === TradeDirection.Call) {
        tradePrice = price.currentAsk
      } else {
        tradePrice = price.currentBid
      }
    }

    return tradePrice
  }

  return undefined
}

export default function discoverTradeRate(symbol: string, tradeDirection: TradeDirection) {
  return controller(db, symbol, tradeDirection)
}
