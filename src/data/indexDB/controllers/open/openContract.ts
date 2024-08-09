import db from "@/data/indexDB/db"

import closeContract from "../close/closeContract"

import type { PriceSimulatorDexie } from "@/data/indexDB/db"
import getTimer from "../get/getTimer"

import getMarketForSymbol from "../get/getMarketForSymbol"
import generateID from "@/utilities/generateID"

import { DEFAULT_CONTRACT_COST } from "../../constants/DEFAULT_CONTRACT_COST"
import lastOfMonth from "@/utilities/lastOfMonth"
import { TradeStatus } from "@/data/indexDB/enums/TradeStatus"

export async function controller(db: PriceSimulatorDexie, symbol: string, direction: "CALL" | "PUT", size: 0.25 | 0.5 | 1 | 2) {
  const count = await db.trades?.where({ status: TradeStatus.OPEN }).count()
  const activeTrades = await db.trades?.where({ symbol, status: TradeStatus.OPEN }).toArray()

  for (const trade of activeTrades) {
    await closeContract(trade.id)
  }

  const timer = await getTimer()
  // const data = await getDataForSymbol(symbol)
  const market = await getMarketForSymbol(symbol)

  const price = await db.prices?.where({ symbol }).first()

  const entryTimestamp = timer?.currentTimestamp
  const expiryTimestamp = lastOfMonth(timer?.currentTimestamp, "WED", 3)?.getTime()

  let entryPrice
  let entryCost

  if (size === 1) {
    if (price?.isMarketClosed) {
      entryPrice = price?.nextOpen
    } else {
      entryPrice = price?.currentClose
    }

    entryCost = DEFAULT_CONTRACT_COST
  } else {
    if (price?.isMarketClosed) {
      entryPrice = direction === "CALL" ? price?.nextBid : price?.nextAsk
    } else {
      entryPrice = direction === "CALL" ? price?.currentBid : price?.currentAsk
    }
  }

  if (market != null && entryTimestamp != null && entryPrice != null) {
    const amount = size * market?.contractSize

    const entryValue = amount * (market?.dollarModifier ?? 1) * entryPrice

    if (price != null) {
      const newContract = {
        id: generateID(),
        no: count + 1,
        status: TradeStatus.OPEN,
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

export default function openContract(symbol: string, direction: "CALL" | "PUT", size: 0.25 | 0.5 | 1 | 2) {
  return controller(db, symbol, direction, size)
}
