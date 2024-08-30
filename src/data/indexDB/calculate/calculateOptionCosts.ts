import calculateOption from "./calculateOption"
import calculateGreeks from "./calculateGreeks"

import { OptionExecution } from "../enums/OptionExecution"

export default async function calculateOptionCosts(
  notional: number,
  spotPrice: number,
  strikePrice: number,
  duration: number,
  execution: OptionExecution,
  volatility: number,
  rate: number
) {
  let greeks

  if (execution === OptionExecution.European) {
    greeks = (await calculateGreeks(spotPrice, strikePrice, duration, volatility, rate)) as any
  }

  const option = (await calculateOption(spotPrice, strikePrice, duration, volatility, rate, execution.toString())) as any

  const callPrice = (notional / spotPrice) * option.call.price
  const putPrice = (notional / spotPrice) * option.put.price

  const input = { duration, execution, spotPrice, strikePrice, volatility, rate }
  const output = { callPrice, putPrice }

  return { input, output, option, greeks }
}
