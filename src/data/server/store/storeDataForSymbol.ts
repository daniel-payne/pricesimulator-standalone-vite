import Dexie from "dexie"

import db from "@/data/indexDB/db"

export default async function storeDataForSymbol(symbol: string, trend: any) {
  await db.timestamps.put(trend.timestamps).catch(Dexie.BulkError, function (e) {
    console.error(`Timestamps for ${symbol} Store Errors : ${e.failures.length}`)
  })

  return trend
}
