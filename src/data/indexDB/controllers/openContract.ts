import db from "@/data/indexDB/db"

import closeContract from "./closeTrade"

import type { PriceSimulatorDexie } from "@/data/indexDB/db"
import getTimer from "./getTimer"

import getMarketForSymbol from "./getMarketForSymbol"
import generateID from "@/utilities/generateID"

import { DEFAULT_CONTRACT_COST } from "../constants/DEFAULT_CONTRACT_COST"
import lastOfMonth from "@/utilities/lastOfMonth"
import { TradeStatus } from "@/data/indexDB/enums/TradeStatus"
import { TradeDirection } from "../enums/TradeDirection"

export async function controller(db: PriceSimulatorDexie, symbol: string, direction: TradeDirection, size: number) {
  const count = await db.trades?.count()
  const activeTrades = await db.trades?.where({ symbol, status: TradeStatus.Open }).toArray()

  for (const trade of activeTrades) {
    await closeContract(trade.id)
  }

  const timer = await getTimer()
  // const data = await getDataForSymbol(symbol)
  const market = await getMarketForSymbol(symbol)

  const price = await db.prices?.where({ symbol }).first()

  const entryTimestamp = timer?.currentTimestamp
  const expiryTimestamp = lastOfMonth(timer?.currentTimestamp, "WED", 1)?.getTime()

  let entryPrice
  let entryCost

  if (size != null) {
    if (price?.isMarketClosed) {
      entryPrice = price?.nextOpen
    } else {
      entryPrice = price?.currentClose
    }

    entryCost = DEFAULT_CONTRACT_COST * size
  } else {
    if (price?.isMarketClosed) {
      entryPrice = direction === TradeDirection.Call ? price?.nextAsk : price?.nextBid
    } else {
      entryPrice = direction === TradeDirection.Call ? price?.currentAsk : price?.currentBid
    }
  }

  if (market != null && entryTimestamp != null && entryPrice != null) {
    const amount = size * market?.contractSize

    const entryValue = ((entryPrice * (market?.priceModifier ?? 1)) / (market?.priceSize ?? 1)) * amount

    if (price != null) {
      const newContract = {
        id: generateID(),
        no: count + 1,
        status: TradeStatus.Open,
        symbol,
        amount,
        direction,
        size,
        entryValue,
        entryPrice,
        entryCost,
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

export default function openContract(symbol: string, direction: TradeDirection, size: number) {
  return controller(db, symbol, direction, size)
}
