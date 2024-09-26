import { Market } from "@/data/indexDB/types/Market"

import type { HTMLAttributes, PropsWithChildren } from "react"

import MarketNameDescription from "../components/MarketNameDescription"
import MarketContractDescription from "../components/MarketContractDescription"
import MarketSummaryDescription from "../components/MarketSummaryDescription"
import ohlcLoadFor from "@/data/indexDB/controllers/ohlcLoadFor"
import MarketBehaviors from "../components/MarketBehaviors"
import { MarketDisplay } from "@/data/indexDB/enums/MarketDisplay"
import SymbolSparkline from "./SymbolSparkline"
import useMarketFor from "@/data/indexDB/hooks/useMarketFor"
import useFavorites from "@/data/localStorage/hooks/useFavorites"
import useOpensFor from "@/data/indexDB/hooks/useOpensFor"
import useTimer from "@/data/indexDB/hooks/useTimer"
import usePriceFor from "@/data/indexDB/hooks/usePriceFor"
import useBehaviorsSelection from "@/data/localStorage/hooks/useBehaviorsSelection"
import MarketHeader from "./MarketHeader"
import MarketFooter from "./MarketFooter"
import useViewSelection from "@/data/localStorage/hooks/useViewSelection"
import useContentSelection from "@/data/localStorage/hooks/useContentSelection"
import MarketChart from "../components/MarketChart"
import useClosesFor from "@/data/indexDB/hooks/useClosesFor"
import useHighsFor from "@/data/indexDB/hooks/useHighsFor"
import useLowsFor from "@/data/indexDB/hooks/useLowsFor"
import DataSparklineDisplay from "../elements/DataSparklineDisplay"
import useRangeSelection from "@/data/localStorage/hooks/useRangeSelection"
import MarketPriceDescription from "../components/MarketPriceDescription"

type ComponentProps = {
  symbol: string

  name?: string
} & HTMLAttributes<HTMLDivElement>

export default function SymbolManager({ symbol, name = "SymbolManager", ...rest }: PropsWithChildren<ComponentProps>) {
  // const timer = useTimer()

  const market = useMarketFor(symbol)
  const highs = useHighsFor(symbol)
  const closes = useClosesFor(symbol)
  const lows = useLowsFor(symbol)
  const price = usePriceFor(symbol)

  const view = useViewSelection()
  const content = useContentSelection()
  const range = useRangeSelection()

  if (market == null) {
    return null
  }

  const hasPrices = (market.priceCount ?? 0) > 0
  const hasNoPrices = !hasPrices

  const showDetails = view === "expanded"

  return (
    <div {...rest} data-component={name}>
      <div className="h-full w-full rounded-xl p-4 bg-base-300 shadow-xl ">
        <div className="h-full w-full flex flex-col gap-2">
          <MarketHeader market={market} />
          {showDetails && (
            <div className=" ">
              {content === "info" && (
                <>
                  <MarketContractDescription market={market} />
                  <MarketSummaryDescription market={market} />
                </>
              )}
              {content === "price" && <MarketPriceDescription market={market} price={price} marketData={closes} />}
              {content === "chart" && (
                <>
                  {/* <MarketChart price={price} marketHighs={highs} marketLows={lows} showYScale={false} /> */}
                  <DataSparklineDisplay className="h-32" price={price} marketData={closes} range={range} />
                </>
              )}
            </div>
          )}
          <MarketFooter market={market} price={price} />
        </div>
      </div>
    </div>
  )
}

/*


        <div className="p-2">
          <div className="flex flex-row justify-between ">
            <MarketNameDescription market={market} />
            {favorites != null && <MarketBehaviors market={market} isFavorite={isFavorite} />}
          </div>
          {display === MarketDisplay.Info && (
            <>
              <div className="flex flex-col gap-2 pt-2">
                <MarketContractDescription market={market} />
                <MarketSummaryDescription market={market} />
              </div>
              {hasNoPrices && (
                <div className="flex flex-row justify-end">
                  <button className="btn btn-sm btn-primary" disabled={market.priceCount > 0} onClick={() => ohlcLoadFor(market.symbol)}>
                    Load Data
                  </button>
                </div>
              )}
            </>
          )}
          {display === MarketDisplay.Line && <SymbolSparkline symbol={market?.symbol} />}
            </div>

*/
