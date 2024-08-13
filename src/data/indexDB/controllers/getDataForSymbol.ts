import db from "@/data/indexDB/db"

import type { PriceSimulatorDexie } from "@/data/indexDB/db"

import loadDataForSymbol from "@/data/server/load/loadDataForSymbol"

import Dexie from "dexie"
import updateStatus from "./updateStatus"

const TIMEGAP_CUTOFF = 10

export async function controller(db: PriceSimulatorDexie, symbol: string | undefined | null) {
  if (symbol == null) {
    return undefined
  }

  if (db.dataCache[symbol] != null) {
    return db.dataCache[symbol]
  }

  updateStatus(symbol, { message: "Retrieving price data" })

  let data = await db.data?.where({ symbol })?.first()

  updateStatus(symbol, { message: "Finished checking for local data" })

  if (data != null) {
    updateStatus(symbol, { message: "Using Data straight from local data" })

    db.dataCache[symbol] = data

    return db.dataCache[symbol]
  } else {
    updateStatus(symbol, { state: "retrieving", message: "Retrieving data from server" })

    data = await loadDataForSymbol(symbol)

    const timestamps = data?.timestamps
    const highs = data?.highs
    const lows = data?.lows
    const opens = data?.opens
    const closes = data?.closes

    if (timestamps == null || highs == null || lows == null || opens == null || closes == null) {
      updateStatus(symbol, { state: "error", message: "Error loading data" })

      return undefined
    }

    updateStatus(symbol, { state: "processing", message: "Processing data" })

    const timegaps = data?.timestamps?.map((value: number, index: number) => {
      if (index === 0) {
        return null
      }

      return (value - timestamps[index - 1]) / (1000 * 60 * 60 * 24)
    })

    const interdays = timestamps.map((_: unknown, index: number) => {
      if (highs != null && lows != null) {
        return highs[index] - lows[index]
      }
    })

    let firstActiveTimestamp: number | null = null
    let firstInterdayTimestamp: number | null = null

    let timeGapFound = false

    if (timegaps?.length && interdays.length) {
      for (let i = timestamps.length - 1; i >= 0; i--) {
        const timegap = timegaps[i] ?? TIMEGAP_CUTOFF + 1
        const interday = interdays[i] ?? 0

        if (timeGapFound === false) {
          if (timegap <= TIMEGAP_CUTOFF) {
            firstActiveTimestamp = timestamps[i]
          } else if (i === 0 && timegap == null) {
            firstActiveTimestamp = timestamps[i]
          } else {
            timeGapFound = true
          }
        }
        if (timeGapFound === false) {
          if (interday > 0 && firstActiveTimestamp != null) {
            firstInterdayTimestamp = timestamps[i]
          }
        }
      }

      if (data != null) {
        const count = timestamps.length

        updateStatus(symbol, { state: "storing", message: "Storing data" })

        await db.data.put(data).catch(Dexie.BulkError, function (e) {
          console.error("loadScenarios Loading Error: " + e.failures.length)
        })

        updateStatus(symbol, { state: "loaded", message: "Local data stored", count, firstActiveTimestamp, firstInterdayTimestamp })
      } else {
        updateStatus(symbol, { state: "error", message: "Local data error" })
      }
    } else {
      updateStatus(symbol, { message: "Using Data from local data" })
    }

    db.dataCache[symbol] = data

    return db.dataCache[symbol]
  }
}

export default function getDataForSymbol(symbol: string | undefined | null) {
  return controller(db, symbol)
}
