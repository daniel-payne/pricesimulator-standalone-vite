import binarySearch from "./binarySearch"

import type { Price } from "@/data/indexDB/types/Price"
import type { Data } from "@/data/indexDB/types/Data"

export default function extractCurrentPriceFromDatum(symbol: string, data: Data, currentDay: string): Price | undefined {
  if (data == null || currentDay == null) {
    return undefined
  }

  const timestamps = data.timestamps
  const opens = data.opens
  const highs = data.highs
  const lows = data.lows
  const closes = data.closes

  const currentTimestamp = new Date(currentDay).getTime()

  if (timestamps == null || opens == null || highs == null || lows == null || closes == null) {
    return undefined
  }

  const index = binarySearch(timestamps, currentTimestamp)

  if (index <= -1) {
    const lastIndex = index * -1

    const lastTimestamp = timestamps[lastIndex - 1]
    const lastDay = new Date(lastTimestamp).toISOString().substring(0, 10)

    const lastClose = closes[lastIndex]
    const nextOpen = opens[lastIndex + 1]

    return { symbol: symbol, day: lastDay, timestamp: lastTimestamp, isMarketClosed: true, index, lastClose, nextOpen }
  } else {
    const open = opens[index]
    const high = highs[index]
    const low = lows[index]
    const close = closes[index]

    return {
      symbol: symbol,
      timestamp: currentTimestamp,
      day: currentDay,
      isMarketClosed: false,
      index,
      open,
      high,
      low,
      close,
    }
  }
}
