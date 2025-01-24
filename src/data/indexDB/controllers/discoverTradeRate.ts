import db from "@/data/indexDB/db"

import type { PriceSimulatorDexie } from "@/data/indexDB/db"
import { TradeDirection } from "../enums/TradeDirection"

export async function controller(db: PriceSimulatorDexie, symbol: string, tradeDirection: TradeDirection) {
  const price = await db.currentPrices.get(symbol)

  if (price != null && price.isMarketActive === true && price.isMarketClosed === false) {
    return tradeDirection === TradeDirection.Call ? price.currentAsk : price.currentBid
  }

  return
}

export default function discoverTradeRate(symbol: string, tradeDirection: TradeDirection) {
  return controller(db, symbol, tradeDirection)
}
