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
            Timer
          </Link>
          <Link to="/balance" className="w-64 btn btn-secondary">
            Balance
          </Link>
        </div>
        <div className="divider">Server</div>
        <div className="m-4 flex flex-row flex-wrap gap-4">
          <Link to="/scenarios" className="w-64 btn btn-secondary">
            Scenarios
          </Link>
          <Link to="/markets" className="w-64 btn btn-secondary">
            Markets
          </Link>
          <Link to="/datas" className="w-64 btn btn-secondary">
            Data
          </Link>
        </div>
        <div className="divider">Local</div>
        <div className="m-4 flex flex-row flex-wrap gap-4">
          <Link to="/quotes" className="w-64 btn btn-secondary">
            Quotes
          </Link>
          <Link to="/trades" className="w-64 btn btn-secondary">
            Trades
          </Link>
          <Link to="/transactions" className="w-64 btn btn-secondary">
            Transactions
          </Link>
        </div>
        <div className="divider">Computed</div>
        <div className="m-4 flex flex-row flex-wrap gap-4">
          <Link to="/statuses" className="w-64 btn btn-secondary">
            Statuses
          </Link>
          <Link to="/prices" className="w-64 btn btn-secondary">
            Prices
          </Link>
          <Link to="/margins" className="w-64 btn btn-secondary">
            Margins
          </Link>
        </div>
        <div className="divider">Markets Views</div>
        <div className="m-4 flex flex-row flex-wrap gap-4">
          <Link to="/marketsByCategory" className="w-64 btn btn-secondary">
            Markets By Category
          </Link>
        </div>
        <div className="divider">Trades Views</div>
        <div className="m-4 flex flex-row flex-wrap gap-4">
          <Link to="/activeTrades" className="w-64 btn btn-secondary">
            Active Trades
          </Link>
          <Link to="/inactiveTrades" className="w-64 btn btn-secondary">
            Inactive Trades
          </Link>
        </div>
        <div className="divider">For ID</div>
        <div className="m-4 flex flex-row flex-wrap gap-4">
          <Link to="/tradeForID" className="w-64 btn btn-secondary">
            Trade For ID
          </Link>
          <Link to="/marginForID" className="w-64 btn btn-secondary">
            Margin For ID
          </Link>
        </div>
        <div className="divider">For Symbol</div>
        <div className="m-4 flex flex-row flex-wrap gap-4">
          <Link to="/marketForSymbol" className="w-64 btn btn-secondary">
            Market For Symbol
          </Link>
          <Link to="/priceForSymbol" className="w-64 btn btn-secondary">
            Price For Symbol
          </Link>
          <Link to="/dataForSymbol" className="w-64 btn btn-secondary  btn-outline">
            Data For Symbol
          </Link>
          <Link to="/quoteForSymbol" className="w-64 btn btn-secondary btn-outline">
            Quote For Symbol
          </Link>
        </div>
      </div>
    </div>
  )
}
