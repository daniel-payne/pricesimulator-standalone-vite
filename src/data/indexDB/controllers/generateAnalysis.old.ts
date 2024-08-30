import db from "@/data/indexDB/db"

import type { PriceSimulatorDexie } from "@/data/indexDB/db"

import type { Analysis } from "@/data/indexDB/types/Analysis"
import { TradeDirection } from "../enums/TradeDirection"
import { OptionDirection } from "../enums/OptionDirection"
import { OptionExecution } from "../enums/OptionExecution"
import calculateOptionCosts from "../calculate/calculateOptionCosts"
// import { OptionExecution } from "../enums/OptionExecution"

// import calculateOptionCosts from "@/data/indexDB/calculate/calculateOptionCosts"
// import { TradeDirection } from "../enums/TradeDirection"
// import { OptionDirection } from "../enums/OptionDirection"
// import { Volatilities } from "../types/Volatilities"

const MIN_CONTRACT_COST = 50

const DEFAULT_DELTA_POINTS = [500, 250, 100, 50, 25, 10, 5, 0, -5, -10, -25, -50, -100, -250, -500]

const EMPTY_ANALYSIS = {
  makeCall: { direction: TradeDirection.Call },
  makePut: { direction: TradeDirection.Put },
  buyCall: { direction: OptionDirection.BuyCall, execution: OptionExecution.European },
  sellCall: { direction: OptionDirection.SellCall, execution: OptionExecution.European },
  buyPut: { direction: OptionDirection.BuyPut, execution: OptionExecution.European },
  sellPut: { direction: OptionDirection.SellPut, execution: OptionExecution.European },
} as unknown as Analysis

export async function controller(db: PriceSimulatorDexie, symbol: string, notional: number, key: string = "USD", duration: number = 30) {
  const analysis = structuredClone(EMPTY_ANALYSIS)

  analysis.symbol = symbol
  analysis.notional = notional

  const currentPrice = await db.currentPrices.get(symbol)
  const currentVolatility = await db.currentVolatilities.get(symbol)
  const currentRate = await db.currentRates.get(key)

  analysis.currentPrice = currentPrice
  analysis.currentVolatility = currentVolatility as any
  analysis.currentRate = currentRate

  if (currentPrice == null || currentVolatility == null || currentRate == null) {
    return analysis
  }

  const matchDuration =
    [30, 60, 90].reduce((acc: any, curr) => {
      if (duration >= curr && acc != null) {
        return curr
      }
    }, null) ?? 90

  const durationVolatility = currentVolatility[matchDuration]

  analysis.durationVolatility = durationVolatility

  if (durationVolatility == null) {
    return analysis
  }

  const isMarketActive = currentPrice?.isMarketActive
  const isMarketClosed = currentPrice?.isMarketClosed
  const priorClose = currentPrice?.priorClose
  const askPrice = currentPrice?.currentAsk
  const bidPrice = currentPrice?.currentBid
  const volatility = durationVolatility.volatility
  const rate = currentRate.currentRate

  analysis.isMarketActive = isMarketActive
  analysis.isMarketClosed = isMarketClosed
  analysis.askPrice = askPrice
  analysis.bidPrice = bidPrice
  analysis.volatility = volatility
  analysis.rate = rate

  let midPrice = priorClose ?? 0

  if (askPrice != null && bidPrice != null) {
    midPrice = (askPrice + bidPrice) / 2
  }

  let deltaFactor = 1 / 10000

  if (midPrice < 10) {
    deltaFactor = 1 / 10000
  } else if (midPrice < 100) {
    deltaFactor = 1 / 1000
  } else if (midPrice < 1000) {
    deltaFactor = 1 / 100
  }

  if (isMarketActive === false || isMarketClosed === true || askPrice == null || bidPrice == null || volatility == null || rate == null) {
    const deltaContracts = DEFAULT_DELTA_POINTS.map((delta) => {
      const rate = midPrice + deltaFactor * delta

      return { delta, rate }
    })

    analysis.makeCall.outcomes = deltaContracts
    analysis.makePut.outcomes = deltaContracts

    analysis.buyCall.tradeOutcomes = deltaContracts
    analysis.sellCall.tradeOutcomes = deltaContracts

    analysis.buyPut.tradeOutcomes = deltaContracts
    analysis.sellPut.tradeOutcomes = deltaContracts

    analysis.buyCall.contracts = deltaContracts
    analysis.sellCall.contracts = deltaContracts

    analysis.buyPut.contracts = deltaContracts
    analysis.sellPut.contracts = deltaContracts

    return analysis
  }

  const makeCallOutcomes = DEFAULT_DELTA_POINTS.map((delta) => {
    const rate = askPrice + deltaFactor * delta
    const percentage = (rate - askPrice) / askPrice
    const profit = percentage * notional

    return { delta, rate, percentage, profit }
  })

  const makePutOutcomes = DEFAULT_DELTA_POINTS.map((delta) => {
    const rate = askPrice + deltaFactor * delta
    const percentage = -1 * ((rate - askPrice) / askPrice)
    const profit = percentage * notional

    return { delta, rate, percentage, profit }
  })

  const emptyContracts = DEFAULT_DELTA_POINTS.map((delta) => {
    const rate = askPrice + deltaFactor * delta

    return { delta, rate }
  })

  analysis.makeCall.outcomes = makeCallOutcomes
  analysis.makePut.outcomes = makePutOutcomes

  analysis.buyCall.tradeOutcomes = makeCallOutcomes
  analysis.sellCall.tradeOutcomes = makeCallOutcomes

  analysis.buyPut.tradeOutcomes = makePutOutcomes
  analysis.sellPut.tradeOutcomes = makePutOutcomes

  analysis.buyCall.contracts = await Promise.all(
    emptyContracts.map(async (contract) => {
      const execution = analysis.buyCall.execution

      const spotPrice = askPrice
      const strikePrice = contract.rate

      const calculation = await calculateOptionCosts(
        notional,
        spotPrice,
        strikePrice,
        duration,
        execution,

        volatility,
        rate
      )

      const outcomes = structuredClone(emptyContracts)

      return { ...contract, calculation, outcomes }
    })
  )

  analysis.buyPut.contracts = await Promise.all(
    emptyContracts.map(async (contract) => {
      const execution = analysis.buyPut.execution

      const spotPrice = bidPrice
      const strikePrice = contract.rate

      const calculation = await calculateOptionCosts(
        notional,
        spotPrice,
        strikePrice,
        duration,
        execution,

        volatility,
        rate
      )

      const outcomes = structuredClone(emptyContracts)

      return { ...contract, calculation, outcomes }
    })
  )

  analysis.sellCall.contracts = structuredClone(analysis.buyCall.contracts)
  analysis.sellPut.contracts = structuredClone(analysis.buyPut.contracts)

  for (const contract of analysis.buyCall.contracts) {
    const outcomes = contract.outcomes
    const contractRate = contract.rate

    const unitCost = contract.calculation.option.call.price
    const contractCost = (notional / askPrice) * unitCost * 1.06

    contract.unitCost = unitCost
    contract.contractCost = contractCost

    if (outcomes != null && contractCost > MIN_CONTRACT_COST) {
      for (const outcome of outcomes) {
        const outcomeRate = outcome.rate

        if (outcomeRate != null && contractRate != null) {
          const percentage = (outcomeRate - contractRate) / contractRate

          outcome.percentage = percentage

          let profit = percentage * notional - contractCost

          if (profit < contractCost * -1) {
            profit = contractCost * -1
          }

          outcome.profit = profit
        }
      }
    }
  }

  for (const contract of analysis.sellCall.contracts) {
    const outcomes = contract.outcomes
    const contractRate = contract.rate

    const unitCost = contract.calculation.option.call.price
    const contractCost = (notional / askPrice) * unitCost * 0.94

    contract.unitCost = unitCost
    contract.contractCost = contractCost

    if (outcomes != null && contractCost > MIN_CONTRACT_COST) {
      for (const outcome of outcomes) {
        const outcomeRate = outcome.rate

        if (outcomeRate != null && contractRate != null) {
          const percentage = (contractRate - outcomeRate) / contractRate

          outcome.percentage = percentage

          let profit = percentage * notional - contractCost

          if (profit > contractCost) {
            profit = contractCost
          }

          outcome.profit = profit
        }
      }
    }
  }

  for (const contract of analysis.buyPut.contracts) {
    const outcomes = contract.outcomes
    const contractRate = contract.rate

    const unitCost = contract.calculation.option.put.price
    const contractCost = (notional / bidPrice) * unitCost * 1.06

    contract.unitCost = unitCost
    contract.contractCost = contractCost

    if (outcomes != null && contractCost > MIN_CONTRACT_COST) {
      for (const outcome of outcomes) {
        const outcomeRate = outcome.rate

        if (outcomeRate != null && contractRate != null) {
          const percentage = (contractRate - outcomeRate) / contractRate

          outcome.percentage = percentage

          let profit = percentage * notional - contractCost

          if (profit < contractCost * -1) {
            profit = contractCost * -1
          }

          outcome.profit = profit
        }
      }
    }
  }

  for (const contract of analysis.sellPut.contracts) {
    const outcomes = contract.outcomes
    const contractRate = contract.rate

    const unitCost = contract.calculation.option.put.price
    const contractCost = (notional / bidPrice) * unitCost * 0.94

    contract.unitCost = unitCost
    contract.contractCost = contractCost

    if (outcomes != null && contractCost > MIN_CONTRACT_COST) {
      for (const outcome of outcomes) {
        const outcomeRate = outcome.rate

        if (outcomeRate != null && contractRate != null) {
          const percentage = (outcomeRate - contractRate) / contractRate

          outcome.percentage = percentage

          let profit = percentage * notional - contractCost

          if (profit > contractCost) {
            profit = contractCost
          }

          outcome.profit = profit
        }
      }
    }
  }

  return analysis
}

export default function generateAnalysis(symbol: string, notional: number) {
  return controller(db, symbol, notional)
}
