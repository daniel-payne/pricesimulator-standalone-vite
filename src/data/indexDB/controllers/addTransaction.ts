import db from "@/data/indexDB/db"

import type { PriceSimulatorDexie } from "@/data/indexDB/db"
import generateID from "@/utilities/generateID"
import getTimer from "./getTimer"
import { Transaction } from "../types/Transaction"

export async function controller(db: PriceSimulatorDexie, value: number, source?: string, index?: number, description?: string) {
  const timer = await getTimer()

  const reference = generateID()
  const currentIndex = timer?.currentIndex

  if (index != null || currentIndex != null) {
    const newTransaction = {
      reference,
      index: index ?? currentIndex,
      source: source ?? "TRADING",
      value,
      description,
    } as Transaction

    db.transactions.add(newTransaction)

    return newTransaction
  }
}

export default function addTransaction(value: number, source?: string, timestamp?: number, reference?: string) {
  return controller(db, value, source, timestamp, reference)
}
