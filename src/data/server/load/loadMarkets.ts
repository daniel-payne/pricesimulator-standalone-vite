import db from "@/data/indexDB/db"
import Dexie from "dexie"

export default async function loadMarkets() {
  const response = await fetch(`http://localhost:4000/rest/markets`, { cache: "no-cache" })

  if (response.ok === false) {
    return { error: response.statusText }
  }

  const markets = await response.json()

  await db.markets.bulkPut(markets).catch(Dexie.BulkError, function (e) {
    console.error("loadScenarios Loading Error: " + e.failures.length)
  })

  return markets
}
