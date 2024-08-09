import { useQueryState } from "@keldan-systems/state-mutex"

import useMarkets from "@/data/indexDB/hooks/useMarkets"

import { useState, type HTMLAttributes, type PropsWithChildren } from "react"
import { Link } from "react-router-dom"

import useMarketForSymbol from "@/data/indexDB/hooks/useMarketForSymbol"
import { MarketDisplay } from "./MarketsPage"

type ComponentProps = {
  name?: string
} & HTMLAttributes<HTMLDivElement>

export default function MarketForSymbolPage({ name = "MarketForSymbolPage", ...rest }: PropsWithChildren<ComponentProps>) {
  const [showJson, setShowJson] = useQueryState<boolean>("showJson", false)
  const [symbol, setSymbol] = useState<string | undefined>()

  const markets = useMarkets()

  return (
    <div {...rest} data-component={name}>
      <div className="flex flex-col gap-2 p-3">
        <div className="flex flex-row flex-wrap gap-2 items-center">
          <Link to="/" className="btn btn-primary btn-sm mx-2">
            Home
          </Link>
          <div className="text-secondary text-2xl font-bold">Markets</div>
          <button className="btn btn-primary btn-ghost btn-sm" onClick={() => setShowJson(!showJson)}>
            json
          </button>
        </div>
        <div className="flex-auto flex flex-row flex-wrap gap-2">
          {markets?.map((market) => (
            <button className={`btn btn-primary ${market.symbol === symbol ? "" : "btn-outline"}`} onClick={() => setSymbol(market.symbol)}>
              {market.symbol}
            </button>
          ))}
        </div>
        <div>
          <MarketForSymbolDisplay symbol={symbol} showJson={showJson} />
        </div>
      </div>
    </div>
  )
}

export const MarketForSymbolDisplay = ({ symbol, showJson = false }: { symbol?: string; showJson?: boolean | undefined | null }) => {
  const market = useMarketForSymbol(symbol)

  if (market == null) return null

  return <MarketDisplay market={market} showJson={showJson} />
}
