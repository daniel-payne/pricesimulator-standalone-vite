import { useLiveQuery } from "dexie-react-hooks"

import db from "@/data/indexDB/db"

import compareObjectsBy from "@/utilities/compareObjectsBy"

import type { Transaction } from "@/data/indexDB/types/Transaction"

export default function useTransactions(): Array<Transaction> | undefined {
  const transactions = useLiveQuery(async () => {
    return await db.transactions?.toArray()
  })

  transactions?.sort(compareObjectsBy("timestamp"))

  return transactions
}
