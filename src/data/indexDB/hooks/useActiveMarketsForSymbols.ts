import type { Market } from "@/data/indexDB/types/Market"

import useActiveMarkets from "./useActiveMarkets"

export default function useActiveMarketsForSymbols(symbols: string | undefined): Array<Market> | undefined {
  const activeMarkets = useActiveMarkets()

  const delimitedSymbols = symbols
    ?.split(",")
    .map((item) => `"${item}"`)
    .join("")

  if (delimitedSymbols != null) {
    const filteredMarkets = activeMarkets?.filter((market) => delimitedSymbols?.includes(`"${market.symbol}"`))

    return filteredMarkets
  }
}
