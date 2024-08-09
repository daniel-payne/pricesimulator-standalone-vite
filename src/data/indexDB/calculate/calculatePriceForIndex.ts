import { Price } from "../types/Price"
import { DEFAULT_SPREAD } from "../constants/DEFAULT_SPREAD"
import formatTimestampISO from "@/utilities/formatTimestampISO"
import formatTimestampDay from "@/utilities/formatTimestampDay"

export default async function calculatePriceForIndex(
  symbol: string,
  timestamps?: Array<number> | null | undefined,
  opens?: Array<number> | null | undefined,
  highs?: Array<number> | null | undefined,
  lows?: Array<number> | null | undefined,
  closes?: Array<number> | null | undefined,
  index?: number | undefined,
  spread: number = DEFAULT_SPREAD,
  timestamp?: number
) {
  if (index == null || timestamp == null || timestamps == null || highs == null || opens == null || lows == null || closes == null) {
    return null
  }

  const indexEnd = timestamps.length - 1

  let price: Price | undefined

  if (indexEnd != null) {
    const isMarketClosed = index <= 0
    const maxIndex = timestamps.length - 1

    let priorIndex
    let priorTimestamp
    let priorTimestampISO
    let priorTimestampDay
    let priorOpen
    let priorClose
    let priorClosingBid
    let priorClosingAsk

    let currentIndex
    let currentTimestamp
    let currentTimestampISO
    let currentTimestampDay
    let currentOpen
    let currentHigh
    let currentLow
    let currentClose
    let currentBid
    let currentAsk
    let currentMidRangePrice
    let currentMidDayPrice
    let currentClosingBid
    let currentClosingAsk

    let nextIndex
    let nextTimestamp
    let nextTimestampISO
    let nextTimestampDay
    let nextOpen
    let nextOpeningBid
    let nextOpeningAsk

    let hasIntraDayPrices

    if (isMarketClosed) {
      priorIndex = Math.abs(index) - 1
      nextIndex = Math.abs(index)
    } else {
      priorIndex = index - 1
      currentIndex = index
      nextIndex = index + 1
    }

    if (priorIndex != null && priorIndex > 0) {
      priorTimestamp = timestamps[priorIndex]
      priorTimestampISO = formatTimestampISO(priorTimestamp)
      priorTimestampDay = formatTimestampDay(priorTimestamp)
      priorOpen = opens[priorIndex]
      priorClose = closes[priorIndex]

      priorClosingBid = priorClose * (1 + spread)
      priorClosingAsk = priorClose * (1 - spread)
    }

    if (currentIndex != null && currentIndex <= maxIndex) {
      currentTimestamp = timestamps[currentIndex]
      currentTimestampISO = formatTimestampISO(currentTimestamp)
      currentTimestampDay = formatTimestampDay(currentTimestamp)
      currentOpen = opens[currentIndex]
      currentClose = closes[currentIndex]
      currentHigh = highs[currentIndex]
      currentLow = lows[currentIndex]

      currentMidRangePrice = Math.random() * (currentHigh - currentLow) + currentLow
      currentMidDayPrice = Math.random() * Math.abs(currentOpen - currentClose) + Math.min(currentOpen, currentClose)

      currentBid = ((3 * currentMidRangePrice + 1 * currentMidDayPrice) / 4) * (1 + spread)
      currentAsk = ((3 * currentMidRangePrice + 1 * currentMidDayPrice) / 4) * (1 - spread)

      currentClosingBid = currentClose * (1 + spread)
      currentClosingAsk = currentClose * (1 - spread)

      hasIntraDayPrices = !(currentOpen === currentClose && currentHigh === currentLow)
    }

    if (nextIndex != null && nextIndex <= maxIndex) {
      nextTimestamp = timestamps[nextIndex]
      nextTimestampISO = formatTimestampISO(nextTimestamp)
      nextTimestampDay = formatTimestampDay(nextTimestamp)
      nextOpen = opens[nextIndex]

      nextOpeningBid = nextOpen * (1 + spread)
      nextOpeningAsk = nextOpen * (1 - spread)
    }

    price = {
      symbol,

      currentIndex,

      isMarketClosed,

      currentTimestamp,
      currentTimestampISO,
      currentTimestampDay,
      currentOpen,
      currentHigh,
      currentLow,
      currentClose,
      currentMidRangePrice,
      currentMidDayPrice,
      currentBid,
      currentAsk,
      currentClosingAsk,
      currentClosingBid,

      priorIndex,
      priorTimestamp,
      priorTimestampISO,
      priorTimestampDay,
      priorOpen,
      priorClose,
      priorClosingBid,
      priorClosingAsk,

      nextIndex,
      nextTimestamp,
      nextTimestampISO,
      nextTimestampDay,
      nextOpen,
      nextOpeningBid,
      nextOpeningAsk,

      hasIntraDayPrices,
    }
  }

  return price
}
