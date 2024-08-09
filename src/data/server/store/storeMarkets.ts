import Dexie from "dexie"

import db from "@/data/indexDB/db"

export default async function storeMarkets(markets: any) {
  await db.markets.put(markets).catch(Dexie.BulkError, function (e) {
    console.error("Store Markets Error: " + e.failures.length)
  })

  return markets
}
