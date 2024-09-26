import marketsLoad from "@/data/indexDB/controllers/marketsLoad"
import ohlcLoadAll from "@/data/indexDB/controllers/ohlcLoadAll"
import { MarketDisplay } from "@/data/indexDB/enums/MarketDisplay"
import useMarkets from "@/data/indexDB/hooks/useMarkets"
import { Market } from "@/data/indexDB/types/Market"

import MarketDetails from "@/display/components/MarketDetails"
import { useLocalState } from "@keldan-systems/state-mutex"

import { useState, type HTMLAttributes, type PropsWithChildren } from "react"
import { Link } from "react-router-dom"

type ComponentProps = {
  name?: string
} & HTMLAttributes<HTMLDivElement>

export default function MarketsDataPage({ name = "MarketsDataPage", ...rest }: PropsWithChildren<ComponentProps>) {
  const [showJSON, setShowJSON] = useState(false)

  const [favorites] = useLocalState<Array<string>>("MARKET-FAVORITES", [])

  const markets = useMarkets()

  return (
    <div {...rest} data-component={name}>
      <div className="p-2">
        <div className="flex flex-row gap-2 items-center p-2">
          <Link to="/">
            <img src="/pricesimulator-32.png" alt="Home Page" style={{ height: 32, width: 32 }} />
          </Link>
          <h1 className="text-xl text-secondary">Market Data</h1>
          <button className={`btn btn-sm btn-primary ${showJSON ? "" : "btn-outline"}`} onClick={() => setShowJSON(!showJSON)}>
            json
          </button>
        </div>

        <div className="divider">Actions</div>
        <div className="flex flex-row gap-2 items-center flex-wrap p-2">
          <button className="btn btn-sm btn-success" onClick={() => marketsLoad()}>
            Reload
          </button>
          <button className="btn btn-sm btn-success" onClick={() => ohlcLoadAll()}>
            Load All Data
          </button>
        </div>

        <div className="divider">Components</div>
        <div className="flex flex-row items-center flex-wrap">
          {markets?.map((market: Market) => (
            <div className="w-1/4 p-2" key={market.symbol}>
              <MarketDetails market={market} favorites={favorites} display={MarketDisplay.Info} />
            </div>
          ))}
        </div>

        {showJSON && (
          <div>
            <div className="divider">JSON</div>
            <pre className="flex flex-row gap-2 items-center flex-wrap p-2">{JSON.stringify(markets, null, 2)}</pre>
          </div>
        )}
      </div>
    </div>
  )
}
