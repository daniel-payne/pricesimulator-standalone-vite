import { useQueryState } from "@keldan-systems/state-mutex"

import useTrades from "@/data/indexDB/hooks/useTrades"

import type { HTMLAttributes, PropsWithChildren } from "react"
import { Link } from "react-router-dom"

import formatValue from "@/utilities/formatValue"
import formatNumber from "@/utilities/formatNumber"
import formatIndexAsDate from "@/utilities/formatIndexAsDate"

type ComponentProps = {
  name?: string
} & HTMLAttributes<HTMLDivElement>

export default function TradesPage({ name = "TradesPage", ...rest }: PropsWithChildren<ComponentProps>) {
  const [showJson, setShowJson] = useQueryState<boolean>("showJson", false)

  const trades = useTrades()

  return (
    <div {...rest} data-component={name}>
      <div className="flex flex-col gap-2 p-3">
        <div className="flex flex-row flex-wrap gap-2 items-center">
          <Link to="/" className="btn btn-primary btn-sm mx-2">
            Home
          </Link>
          <div className="text-secondary text-2xl font-bold">Trades</div>
          <button className="btn btn-primary btn-ghost btn-sm" onClick={() => setShowJson(!showJson)}>
            json
          </button>
        </div>
        <div className="flex-auto flex flex-row flex-wrap gap-0">
          {trades?.map((trade) => {
            return (
              <div className="w-96 p-2" key={trade.id}>
                <div className="w-full h-full border border-primary rounded-xl p-2 overflow-hidden">
                  <div className="text-primary text-xl font-bold">{trade.id}</div>
                  {showJson && <pre>{JSON.stringify(trade, null, 2)}</pre>}
                  <div className="text-secondary font-bold">
                    {trade?.direction} {formatValue(trade?.entryValue, false)} {trade?.symbol}
                  </div>
                  <div className="text-secondary font-bold">{formatValue(trade?.profit, false)}&nbsp;</div>
                  <div className="text-secondary">
                    {formatIndexAsDate(trade?.entryIndex)} {formatNumber(trade?.entryPrice, 6)}
                  </div>
                  <div className="text-secondary">
                    {formatIndexAsDate(trade?.exitIndex)} {formatNumber(trade?.exitPrice, 6)}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
