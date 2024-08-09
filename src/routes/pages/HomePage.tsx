import { Link } from "react-router-dom"

import type { HTMLAttributes, PropsWithChildren } from "react"

type ComponentProps = {
  name?: string
} & HTMLAttributes<HTMLDivElement>

export default function HomePage({ name = "HomePage", ...rest }: PropsWithChildren<ComponentProps>) {
  return (
    <div {...rest} data-component={name}>
      <div className="h-full w-full m-4 flex flex-col">
        <div className="divider">Actions</div>
        <div className="m-4 flex flex-row flex-wrap gap-4">
          <Link to="/actions" className="w-64 btn btn-primary">
            Actions
          </Link>
        </div>
        <div className="divider">Singletons </div>
        <div className="m-4 flex flex-row flex-wrap gap-4">
          <Link to="/timer" className="w-64 btn btn-secondary">
            useTimer
          </Link>
          <Link to="/balance" className="w-64 btn btn-secondary">
            useBalance
          </Link>
        </div>
        <div className="divider">Server</div>
        <div className="m-4 flex flex-row flex-wrap gap-4">
          <Link to="/scenarios" className="w-64 btn btn-secondary">
            useScenarios
          </Link>
          <Link to="/markets" className="w-64 btn btn-secondary">
            useMarkets
          </Link>
          <Link to="/datas" className="w-64 btn btn-secondary">
            useDatas
          </Link>
        </div>
        <div className="divider">Local</div>
        <div className="m-4 flex flex-row flex-wrap gap-4">
          <Link to="/quotes" className="w-64 btn btn-secondary">
            useQuotes
          </Link>
          <Link to="/trades" className="w-64 btn btn-secondary">
            useTrades
          </Link>
          <Link to="/transactions" className="w-64 btn btn-secondary">
            useTransactions
          </Link>
        </div>
        <div className="divider">Computed</div>
        <div className="m-4 flex flex-row flex-wrap gap-4">
          <Link to="/statuses" className="w-64 btn btn-secondary">
            useStatuses
          </Link>
          <Link to="/prices" className="w-64 btn btn-secondary">
            usePrices
          </Link>
          <Link to="/margins" className="w-64 btn btn-secondary">
            useMargins
          </Link>
        </div>
        <div className="divider">Markets Views</div>
        <div className="m-4 flex flex-row flex-wrap gap-4">
          <Link to="/marketsByCategory" className="w-64 btn btn-secondary">
            MarketsByCategory
          </Link>
        </div>
        <div className="divider">Trades Views</div>
        <div className="m-4 flex flex-row flex-wrap gap-4">
          <Link to="/activeTrades" className="w-64 btn btn-secondary">
            useActiveTrades
          </Link>
          <Link to="/inactiveTrades" className="w-64 btn btn-secondary">
            useInactiveTrades
          </Link>
        </div>
        <div className="divider">For ID</div>
        <div className="m-4 flex flex-row flex-wrap gap-4">
          <Link to="/tradeForID" className="w-64 btn btn-secondary">
            TradeForID
          </Link>
          <Link to="/marginForID" className="w-64 btn btn-secondary">
            MarginForID
          </Link>
        </div>
        <div className="divider">For Symbol</div>
        <div className="m-4 flex flex-row flex-wrap gap-4">
          <Link to="/marketForSymbol" className="w-64 btn btn-secondary">
            useMarketForSymbol
          </Link>
          <Link to="/priceForSymbol" className="w-64 btn btn-secondary">
            usePriceForSymbol
          </Link>
          <Link to="/dataForSymbol" className="w-64 btn btn-secondary  btn-outline">
            DataForSymbol
          </Link>
          <Link to="/quoteForSymbol" className="w-64 btn btn-secondary btn-outline">
            QuoteForSymbol
          </Link>
        </div>
      </div>
    </div>
  )
}
