import useMarketForSymbol from "@/data/indexDB/hooks/useMarketForSymbol"
import type { Market } from "@/data/indexDB/types/Market"
import { useQueryState } from "@keldan-systems/state-mutex"
import { useParams } from "react-router-dom"

export default function useMarketFromUrl(): Market | undefined {
  const [querySymbol] = useQueryState<string>("symbol")
  const { symbol: paramsSymbol } = useParams()

  const market = useMarketForSymbol(querySymbol?.toUpperCase() ?? paramsSymbol?.toUpperCase() ?? "MISSING")

  return market
}
