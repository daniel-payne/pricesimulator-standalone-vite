import { useQueryState } from "@keldan-systems/state-mutex"

import useMarkets from "@/data/indexDB/hooks/useMarkets"

import { useState, type HTMLAttributes, type PropsWithChildren } from "react"
import { Link } from "react-router-dom"

import usePriceForSymbol from "@/data/indexDB/hooks/usePriceForSymbol"
import { PriceDisplay } from "./PricesPage"

type ComponentProps = {
  name?: string
} & HTMLAttributes<HTMLDivElement>

export default function PriceForSymbolPage({ name = "PriceForSymbolPage", ...rest }: PropsWithChildren<ComponentProps>) {
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
            <button key={market.symbol} className={`btn btn-primary ${market.symbol === symbol ? "" : "btn-outline"}`} onClick={() => setSymbol(market.symbol)}>
              {market.symbol}
            </button>
          ))}
        </div>
        <div>
          <MPriceForSymbolDisplay symbol={symbol} showJson={showJson} />
        </div>
      </div>
    </div>
  )
}

export const MPriceForSymbolDisplay = ({ symbol, showJson = false }: { symbol?: string; showJson?: boolean | undefined | null }) => {
  const price = usePriceForSymbol(symbol)

  if (price == null) return null

  return <PriceDisplay price={price} showJson={showJson} />
}
