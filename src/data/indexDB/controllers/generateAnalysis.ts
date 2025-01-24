import db from "@/data/indexDB/db"

import type { PriceSimulatorDexie } from "@/data/indexDB/db"

import type { Analysis } from "@/data/indexDB/types/Analysis"
import { TradeDirection } from "../enums/TradeDirection"
import { OptionDirection } from "../enums/OptionDirection"
import { OptionExecution } from "../enums/OptionExecution"

import discoverOptionPrice from "./discoverOptionPrice"
import { VOLATILITY_DURATIONS } from "../constants/VOLATILITY_DURATIONS"
import { DELTA_POINTS } from "../constants/DELTA_POINTS"

const EMPTY_ANALYSIS = {
  profit: {},
  makeCall: { direction: TradeDirection.Call },
  makePut: { direction: TradeDirection.Put },
  buyCall: { direction: OptionDirection.BuyCall, execution: OptionExecution.European },
  sellCall: { direction: OptionDirection.SellCall, execution: OptionExecution.European },
  buyPut: { direction: OptionDirection.BuyPut, execution: OptionExecution.European },
  sellPut: { direction: OptionDirection.SellPut, execution: OptionExecution.European },
} as unknown as Analysis

export async function controller(db: PriceSimulatorDexie, symbol: string, notional: number, duration: number = 30, key: string = "USD") {
  const analysis = structuredClone(EMPTY_ANALYSIS)

  analysis.symbol = symbol
  analysis.notional = notional
  analysis.duration = duration

  const currentPrice = await db.currentPrices.get(symbol)
  const currentVolatility = await db.currentVolatilities.get(symbol)
  const currentRate = await db.currentRates.get(key)

  analysis.currentPrice = currentPrice
  analysis.currentVolatility = currentVolatility as any
  analysis.currentRate = currentRate

  if (currentPrice == null || currentVolatility == null || currentRate == null) {
    return analysis
  }

  const isMarketActive = currentPrice?.isMarketActive
  const isMarketClosed = currentPrice?.isMarketClosed
  const priorClose = currentPrice?.priorClose
  const askPrice = currentPrice?.currentAsk
  const bidPrice = currentPrice?.currentBid
  const rate = currentRate.currentRate

  analysis.isMarketActive = isMarketActive
  analysis.isMarketClosed = isMarketClosed
  analysis.askPrice = askPrice
  analysis.bidPrice = bidPrice
  analysis.rate = rate

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

  analysis.profit = { outcomes: [] }

  analysis.makeCall = { direction: TradeDirection.Call, outcomes: [] }
  analysis.makePut = { direction: TradeDirection.Put, outcomes: [] }

  analysis.buyCall = { direction: OptionDirection.BuyCall, execution: OptionExecution.European, tradeOutcomes: [], contracts: [] }
  analysis.sellCall = { direction: OptionDirection.SellCall, execution: OptionExecution.European, tradeOutcomes: [], contracts: [] }
  analysis.buyPut = { direction: OptionDirection.BuyPut, execution: OptionExecution.European, tradeOutcomes: [], contracts: [] }
  analysis.sellPut = { direction: OptionDirection.SellPut, execution: OptionExecution.European, tradeOutcomes: [], contracts: [] }

  if (askPrice == null || bidPrice == null || rate == null) {
    return analysis
  }

  DELTA_POINTS.forEach((delta, index) => {
    const askRate = askPrice + deltaFactor * delta
    const bidRate = bidPrice + deltaFactor * delta

    const midRate = (askRate + bidRate) / 2

    analysis.profit.outcomes.push({ delta, index, askRate, bidRate, midRate })

    analysis.makeCall.outcomes.push({ delta, rate: askRate })
    analysis.makePut.outcomes.push({ delta, rate: bidRate })

    analysis.buyCall.tradeOutcomes.push({ delta, rate: askRate })
    analysis.sellCall.tradeOutcomes.push({ delta, rate: askRate })
    analysis.buyPut.tradeOutcomes.push({ delta, rate: bidRate })
    analysis.sellPut.tradeOutcomes.push({ delta, rate: bidRate })

    analysis.buyCall.contracts.push({
      delta,
      direction: OptionDirection.BuyCall,
      execution: OptionExecution.European,
      spotPrice: askPrice,
      strikePrice: askRate,
      outcomes: [],
    })
    analysis.sellCall.contracts.push({
      delta,
      direction: OptionDirection.SellCall,
      execution: OptionExecution.European,
      spotPrice: askPrice,
      strikePrice: askRate,
      outcomes: [],
    })
    analysis.buyPut.contracts.push({
      direction: OptionDirection.BuyPut,
      execution: OptionExecution.European,
      delta,
      spotPrice: bidPrice,
      strikePrice: bidRate,
      outcomes: [],
    })
    analysis.sellPut.contracts.push({
      direction: OptionDirection.SellPut,
      execution: OptionExecution.European,
      delta,
      spotPrice: bidPrice,
      strikePrice: bidRate,
      outcomes: [],
    })
  })

  DELTA_POINTS.forEach((delta) => {
    const askRate = askPrice + deltaFactor * delta
    const bidRate = bidPrice + deltaFactor * delta

    analysis.buyCall.contracts.forEach((contract) => {
      contract.outcomes.push({ delta, rate: askRate })
    })
    analysis.sellCall.contracts.forEach((contract) => {
      contract.outcomes.push({ delta, rate: askRate })
    })
    analysis.buyPut.contracts.forEach((contract) => {
      contract.outcomes.push({ delta, rate: bidRate })
    })
    analysis.sellPut.contracts.forEach((contract) => {
      contract.outcomes.push({ delta, rate: bidRate })
    })
  })

  analysis.makeCall.outcomes.forEach((outcome) => {
    const rate = outcome.rate

    const percentage = (rate - askPrice) / askPrice
    const tradeProfit = percentage * notional

    outcome.percentage = percentage
    outcome.tradeProfit = tradeProfit
  })

  analysis.makePut.outcomes.forEach((outcome) => {
    const rate = outcome.rate

    const percentage = (bidPrice - rate) / bidPrice
    const tradeProfit = percentage * notional

    outcome.percentage = percentage
    outcome.tradeProfit = tradeProfit
  })

  const allOptionContracts = [...analysis.buyCall.contracts, ...analysis.sellCall.contracts, ...analysis.buyPut.contracts, ...analysis.sellPut.contracts]

  // allOptionContracts.forEach(async (contract) => {

  for await (const contract of allOptionContracts) {
    const { contractCost, unitCost, calculation } = await discoverOptionPrice(
      symbol,
      "USD",
      notional,
      contract.direction,
      contract.execution,
      contract.delta,
      duration
    )

    if (contractCost != null) {
      contract.contractCost = contractCost

      contract.calculation = calculation
      contract.unitCost = unitCost

      contract.outcomes.forEach((outcome) => {
        const outcomeRate = outcome.rate

        let percentage
        let tradeProfit
        let netProfit
        let maxLoss
        let maxProfit

        let profit

        switch (contract.direction) {
          case OptionDirection.BuyCall:
            percentage = (outcomeRate - contract.strikePrice) / contract.strikePrice
            tradeProfit = percentage * notional
            netProfit = tradeProfit - contractCost
            maxLoss = contractCost * -1
            profit = netProfit <= maxLoss ? maxLoss : netProfit
            break
          case OptionDirection.SellCall:
            percentage = ((outcomeRate - contract.strikePrice) / contract.strikePrice) * -1
            tradeProfit = percentage * notional
            netProfit = tradeProfit + contractCost
            maxProfit = contractCost
            profit = netProfit >= maxProfit ? maxProfit : netProfit
            break
          case OptionDirection.BuyPut:
            percentage = ((outcomeRate - contract.strikePrice) / contract.strikePrice) * -1
            tradeProfit = percentage * notional
            netProfit = tradeProfit - contractCost
            maxLoss = contractCost * -1
            profit = netProfit <= maxLoss ? maxLoss : netProfit
            break
          case OptionDirection.SellPut:
            percentage = (outcomeRate - contract.strikePrice) / contract.strikePrice
            tradeProfit = percentage * notional
            netProfit = tradeProfit + contractCost
            maxProfit = contractCost
            profit = netProfit >= maxProfit ? maxProfit : netProfit
            break
        }

        outcome.percentage = percentage
        outcome.tradeProfit = tradeProfit
        outcome.contractCost = contractCost
        outcome.profit = profit
      })
    }
  }

  return analysis
}

export default function generateAnalysis(symbol: string, notional: number, duration: number = 30, key: string = "USD") {
  return controller(db, symbol, notional, duration, key)
}
