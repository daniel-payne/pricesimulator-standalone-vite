import useTrades from "@/data/indexDB/hooks/useTrades"

import { Trade } from "@/data/indexDB/types/Trade"

import TradeDetails from "@/display/components/TradeDetails"

import { useState, type HTMLAttributes, type PropsWithChildren } from "react"
import { Link } from "react-router-dom"

type ComponentProps = {
  name?: string
} & HTMLAttributes<HTMLDivElement>

export default function TradesDataPage({ name = "TradesDataPage", ...rest }: PropsWithChildren<ComponentProps>) {
  const [showJSON, setShowJSON] = useState(false)

  const trades = useTrades()

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
          <button className="btn btn-sm btn-success" disabled onClick={() => null}>
            Open Contract
          </button>

          <button className="btn btn-sm btn-success" disabled onClick={() => null}>
            Open Trade
          </button>

          <button className="btn btn-sm btn-success" disabled onClick={() => null}>
            Open Option
          </button>
          <button className="btn btn-sm btn-warning" disabled onClick={() => null}>
            Close All Open Contracts
          </button>
        </div>

        <div className="divider">Components</div>
        <div className="flex flex-row items-center flex-wrap">
          {trades?.map((trade: Trade) => (
            <div className="w-1/6 p-2">
              <TradeDetails trade={trade} key={trade.id} />
            </div>
          ))}
        </div>

        {showJSON && (
          <div>
            <div className="divider">JSON</div>
            <pre className="flex flex-row gap-2 items-center flex-wrap p-2">{JSON.stringify(trades, null, 2)}</pre>
          </div>
        )}
      </div>
    </div>
  )
}
