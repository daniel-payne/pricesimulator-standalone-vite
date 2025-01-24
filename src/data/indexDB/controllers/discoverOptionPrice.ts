import db from "@/data/indexDB/db"

import type { PriceSimulatorDexie } from "@/data/indexDB/db"

import calculateOptionCosts from "../calculate/calculateOptionCosts"

import { OptionExecution } from "../enums/OptionExecution"
import { OptionDirection } from "../enums/OptionDirection"
import { VOLATILITY_DURATIONS } from "../constants/VOLATILITY_DURATIONS"

const MIN_CONTRACT_COST = 2500
const CONTRACT_MARKUP = 0.075
const CONTRACT_COMMISSION = 800

export async function controller(
  db: PriceSimulatorDexie,
  symbol: string,
  key: string,
  notional: number,
  direction: OptionDirection,
  execution: OptionExecution,
  delta: number,
  duration: number,
  minContractCost: number
) {
  const currentPrice = await db.currentPrices.get(symbol)
  const currentVolatility = await db.currentVolatilities.get(symbol)
  const currentRate = await db.currentRates.get(key)

  if (currentPrice == null || currentVolatility == null || currentRate == null) {
    return {}
  }

  const matchedDuration =
    VOLATILITY_DURATIONS.reduce((acc: any, curr) => {
      if (duration >= curr) {
        return curr
      }
      return acc
    }, null) ?? VOLATILITY_DURATIONS[0]

  const durationVolatility = currentVolatility[matchedDuration]

  if (durationVolatility == null) {
    return {}
  }

  const isMarketActive = currentPrice?.isMarketActive
  const isMarketClosed = currentPrice?.isMarketClosed
  const priorClose = currentPrice?.priorClose
  const askPrice = currentPrice?.currentAsk
  const bidPrice = currentPrice?.currentBid
  const volatility = durationVolatility?.volatility
  const rate = currentRate.currentRate

  if (isMarketActive != true || isMarketClosed != false || askPrice == null || bidPrice == null || priorClose == null || rate == null || volatility == null) {
    return {}
  }

  let midPrice = priorClose ?? 0

  if (askPrice != null && bidPrice != null) {
    midPrice = (askPrice + bidPrice) / 2
  }

  let deltaFactor = 0.0001

  if (midPrice < 0.01) {
    deltaFactor = 0.0000001
  } else if (midPrice < 0.1) {
    deltaFactor = 0.000001
  } else if (midPrice < 1) {
    deltaFactor = 0.00001
  } else if (midPrice < 10) {
    deltaFactor = 0.0001
  } else if (midPrice < 100) {
    deltaFactor = 0.001
  } else if (midPrice < 1000) {
    deltaFactor = 0.01
  } else if (midPrice < 10000) {
    deltaFactor = 0.1
  } else {
    deltaFactor = 1
  }

  const askRate = askPrice + deltaFactor * delta
  const bidRate = bidPrice + deltaFactor * delta

  let spotPrice
  let strikePrice

  switch (direction) {
    case OptionDirection.BuyCall:
      spotPrice = askPrice
      strikePrice = askRate
      break
    case OptionDirection.SellCall:
      spotPrice = askPrice
      strikePrice = askRate
      break
    case OptionDirection.BuyPut:
      spotPrice = bidPrice
      strikePrice = bidRate
      break
    case OptionDirection.SellPut:
      spotPrice = bidPrice
      strikePrice = bidRate
      break
  }

  const calculation = await calculateOptionCosts(
    notional,
    spotPrice,
    strikePrice,
    matchedDuration,
    execution,

    volatility,
    rate
  )

  let unitCost
  let contractCost

  switch (direction) {
    case OptionDirection.BuyCall:
      unitCost = calculation.option.call.price * (1 + CONTRACT_MARKUP)
      contractCost = (notional / strikePrice) * unitCost + CONTRACT_COMMISSION
      break
    case OptionDirection.SellCall:
      unitCost = calculation.option.call.price * (1 - CONTRACT_MARKUP)
      contractCost = (notional / strikePrice) * unitCost - CONTRACT_COMMISSION
      break
    case OptionDirection.BuyPut:
      unitCost = calculation.option.put.price * (1 + CONTRACT_MARKUP)
      contractCost = (notional / strikePrice) * unitCost + CONTRACT_COMMISSION
      break
    case OptionDirection.SellPut:
      unitCost = calculation.option.put.price * (1 - CONTRACT_MARKUP)
      contractCost = (notional / strikePrice) * unitCost - CONTRACT_COMMISSION
      break
  }

  if (contractCost > minContractCost) {
    return { contractCost, unitCost, calculation, matchedDuration }
  }

  return {}
}

export default function discoverOptionPrice(
  symbol: string,
  key: string,
  notional: number,
  optionDirection: OptionDirection,
  optionExecution: OptionExecution,
  strikeDelta: number,
  duration: number,
  minContractCost: number = MIN_CONTRACT_COST
) {
  return controller(db, symbol, key, notional, optionDirection, optionExecution, strikeDelta, duration, minContractCost)
}
