import Dexie, { Table } from "dexie"

import generateID from "@/utilities/generateID"

import { controller as loadData } from "@/data/indexDB/controllers/load/loadData"

import type { Quote } from "./types/Quote"
import type { Trade } from "./types/Trade"
import type { Timer } from "@/data/indexDB/types/Timer"
import type { Scenario } from "@/data/indexDB/types/Scenario"
import type { Market } from "@/data/indexDB/types/Market"
import type { Data } from "@/data/indexDB/types/Data"
import type { Price } from "@/data/indexDB/types/Price"
import { Margin } from "./types/Margin"
import { Transaction } from "./types/Transaction"
import { Balance } from "./types/Balance"
import { Status } from "./types/Status"

export const DIXIE_BALANCE_KEY = "DIXIE_BALANCE_KEY"

export class PriceSimulatorDexie extends Dexie {
  id: string
  timeout: number | null = null

  timer!: Table<Timer>
  balance!: Table<Balance>

  scenarios!: Table<Scenario>
  markets!: Table<Market>

  statuses!: Table<Status>
  data!: Table<Data>

  prices!: Table<Price>

  quotes!: Table<Quote>

  trades!: Table<Trade>
  margins!: Table<Margin>
  transactions!: Table<Transaction>

  dataCache: Record<string, Data | undefined | null> = {}
  pricesCache: Record<string, Price | undefined | null> = {}

  constructor() {
    super("PriceSimulator")

    this.version(36).stores({
      timer: "id",
      balance: "id",

      scenarios: "code, name",
      markets: "symbol, name",

      statuses: "symbol",
      data: "symbol",
      prices: "symbol",

      quotes: "symbol",

      trades: "id, symbol, status, [symbol+status]",
      margins: "id, symbol, status, [symbol+status] ",

      transactions: "id,  timestamp",
    })

    this.id = generateID()
  }
}

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

const db = new PriceSimulatorDexie()

db.on("ready", function () {
  loadData(db)
  // window.addEventListener("onbeforeunload", async () => {
  //   const id = db.id
  //   const collection = await db.status.limit(1)
  //   const currentStatus = await collection.first()
  //   const newStatus = { isTimerActive: false }
  //   if (currentStatus?.id === id) {
  //     await collection.modify({ ...currentStatus, ...newStatus, id })
  //   }
  // })
})

export default db
