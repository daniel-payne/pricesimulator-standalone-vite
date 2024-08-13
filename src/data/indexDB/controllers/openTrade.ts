import db from "@/data/indexDB/db"

import type { PriceSimulatorDexie } from "@/data/indexDB/db"
import getTimer from "./getTimer"

import getMarketForSymbol from "./getMarketForSymbol"
import generateID from "@/utilities/generateID"

import lastOfMonth from "@/utilities/lastOfMonth"
import { TradeStatus } from "@/data/indexDB/enums/TradeStatus"
import { TradeDirection } from "../enums/TradeDirection"

export async function controller(db: PriceSimulatorDexie, symbol: string, direction: TradeDirection, amount: number, entryPrice: number) {
  const count = await db.trades?.count()

  const timer = await getTimer()
  // const data = await getDataForSymbol(symbol)
  const market = await getMarketForSymbol(symbol)

  const price = await db.prices?.where({ symbol }).first()

  const entryTimestamp = timer?.currentTimestamp
  const expiryTimestamp = lastOfMonth(timer?.currentTimestamp, "WED", 1)?.getTime()

  if (market != null && entryTimestamp != null && entryPrice != null) {
    const entryValue = ((entryPrice * (market?.priceModifier ?? 1)) / (market?.priceSize ?? 1)) * amount

    if (price != null) {
      const newContract = {
        id: generateID(),
        no: count + 1,
        status: TradeStatus.Open,
        symbol,
        amount,
        direction,
        entryValue,
        entryPrice,
        entryTimestamp,
        exitPrice: undefined,
        exitValue: undefined,
        exitCost: undefined,
        exitTimestamp: undefined,
        expiryTimestamp,
        profit: undefined,
      }

      await db.trades?.put(newContract)

      return newContract
    }
  }

  return undefined
}

export default function openTrade(symbol: string, direction: TradeDirection, amount: number, entryPrice: number) {
  return controller(db, symbol, direction, amount, entryPrice)
}
