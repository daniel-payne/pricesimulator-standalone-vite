import db from "@/data/indexDB/db"

import type { PriceSimulatorDexie } from "@/data/indexDB/db"
import { TradeStatus } from "../enums/TradeStatus"
import getTimer from "./getTimer"

export async function controller(db: PriceSimulatorDexie) {
  const guid = db.guid

  const timer = await getTimer()

  const currentIndex = timer?.currentIndex ?? 0

  const transactions = await db.transactions?.toArray()
  const margins = await db.currentMargins?.where({ status: TradeStatus.Open }).toArray()

  const transactionBalance = transactions.reduce((acc, transaction) => {
    return acc + transaction.value
  }, 0)

  const marginBalance = margins.reduce((acc, margin) => {
    return acc + margin.currentProfit
  }, 0)

  const availableBalance = (transactionBalance ?? 0) + (marginBalance ?? 0)

  const newBalance = { guid, currentIndex, transactionBalance, marginBalance, availableBalance }

  await db.currentBalance.clear()
  await db.currentBalance.add(newBalance)

  return newBalance
}

export default function recalculateCurrentBalance() {
  return controller(db)
}
