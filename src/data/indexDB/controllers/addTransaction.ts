import db from "@/data/indexDB/db"

import type { PriceSimulatorDexie } from "@/data/indexDB/db"
import generateID from "@/utilities/generateID"
import getTimer from "./getTimer"
import { Transaction } from "../types/Transaction"

export async function controller(db: PriceSimulatorDexie, value: number, source?: string, timestamp?: number, reference?: string) {
  const timer = await getTimer()

  const id = generateID()
  const currentTimestamp = timer?.currentTimestamp

  if (timestamp != null || currentTimestamp != null) {
    const newTransaction = {
      id,
      timestamp: timestamp ?? currentTimestamp,
      source: source ?? "TRADING",
      value,
      reference,
    } as Transaction

    db.transactions.add(newTransaction)

    return newTransaction
  }
}

export default function addTransaction(value: number, source?: string, timestamp?: number, reference?: string) {
  return controller(db, value, source, timestamp, reference)
}
