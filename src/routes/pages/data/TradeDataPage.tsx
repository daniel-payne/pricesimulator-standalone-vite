import useMarketData from "@/data/indexDB/hooks/useMarketData"
import useTradeData from "@/data/indexDB/hooks/useTrades"
import { Trade } from "@/data/indexDB/types/Trade"
import { Scenario } from "@/data/indexDB/types/Scenario"
import MarketDetails from "@/display/components/MarketDetails"
import ScenarioDetails from "@/display/components/ScenarioDetails"

import { useState, type HTMLAttributes, type PropsWithChildren } from "react"
import { Link } from "react-router-dom"

type ComponentProps = {
  name?: string
} & HTMLAttributes<HTMLDivElement>

export default function TradeDataPage({ name = "TradeDataPage", ...rest }: PropsWithChildren<ComponentProps>) {
  const [showJSON, setShowJSON] = useState(false)

  const tradeData = useTradeData()

  const { data, actions } = tradeData

  return (
    <div {...rest} data-component={name}>
      <div className="p-2">
        <div className="flex flex-row gap-2 items-center p-2">
          <Link to="/">
            <img src="/pricesimulator-32.png" alt="Home Page" style={{ height: 32, width: 32 }} />
          </Link>
          <h1 className="text-xl text-secondary">Trade Data</h1>
          <button className={`btn btn-sm btn-primary ${showJSON ? "" : "btn-outline"}`} onClick={() => setShowJSON(!showJSON)}>
            json
          </button>
        </div>

        <div className="divider">Actions</div>
        <div className="flex flex-row gap-2 items-center flex-wrap p-2">
          <button className="btn btn-sm btn-success" onClick={() => actions.openContract()}>
            Open Contract
          </button>
          <button className="btn btn-sm btn-success" onClick={() => actions.openContract()}>
            Open Trade
          </button>
          <button className="btn btn-sm btn-success" onClick={() => actions.openContract()}>
            Create Option
          </button>
        </div>

        <div className="divider">Components</div>
        <div className="flex flex-row gap-2 items-center flex-wrap p-2">
          {data?.map((trade: Trade) => (
            // <MarketDetails market={market} key={market.symbol} />
            <div>{trade.id}</div>
          ))}
        </div>

        {showJSON && (
          <div>
            <div className="divider">JSON</div>
            <pre className="flex flex-row gap-2 items-center flex-wrap p-2">{JSON.stringify(data, null, 2)}</pre>
          </div>
        )}
      </div>
    </div>
  )
}
