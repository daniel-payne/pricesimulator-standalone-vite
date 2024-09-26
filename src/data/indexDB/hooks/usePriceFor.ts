import useClosesFor from "./useClosesFor"
import useHighsFor from "./useHighsFor"
import useLowsFor from "./useLowsFor"
import useOpensFor from "./useOpensFor"
import useTimer from "./useTimer"
import useMarketFor from "./useMarketFor"

import extractPriceForIndex from "../calculate/extractPriceForIndex"

export default function usePriceFor(symbol = "MISSING") {
  const timer = useTimer()

  const opens = useOpensFor(symbol)
  const closes = useClosesFor(symbol)
  const highs = useHighsFor(symbol)
  const lows = useLowsFor(symbol)

  const market = useMarketFor(symbol)

  const currentPrice = extractPriceForIndex(timer, market, opens, highs, lows, closes)

  return currentPrice
}
