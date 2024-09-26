import { Link } from "react-router-dom"

import type { HTMLAttributes, PropsWithChildren } from "react"

type ComponentProps = {
  name?: string
} & HTMLAttributes<HTMLDivElement>

export default function DataIndexPage({ name = "DataIndexPage", ...rest }: PropsWithChildren<ComponentProps>) {
  return (
    <div {...rest} data-component={name}>
      <div className="h-full w-full p-2flex flex-col ">
        <div className=" flex flex-row gap-2 items-center p-2">
          <Link to="/">
            <img src="/pricesimulator-32.png" alt="Home Page" style={{ height: 32, width: 32 }} />
          </Link>
          <h1 className="text-xl text-secondary">Application Hooks</h1>
        </div>
        <div className="divider">IndexDB Hooks</div>
        <div className="p-2 flex flex-row flex-wrap gap-4">
          <Link to="/data/timer" className="w-64 btn btn-primary">
            Timer
          </Link>
          <Link to="/data/scenarios" className="w-64 btn btn-primary">
            Scenarios
          </Link>
          <Link to="/data/markets" className="w-64 btn btn-primary">
            Markets
          </Link>
          <Link to="/data/currencies" className="w-64 btn btn-primary">
            Currencies
          </Link>
        </div>
        <div className="p-2 flex flex-row flex-wrap gap-4">
          <Link to="/data/ohlc" className="w-64 btn btn-primary">
            OHLCs
          </Link>
          <Link to="/data/rates" className="w-64 btn btn-primary">
            Rates
          </Link>
        </div>
        <div className="p-2 flex flex-row flex-wrap gap-4">
          <Link to="/data/trades" className="w-64 btn btn-primary">
            Trades
          </Link>
          <Link to="/data/transactions" className="w-64 btn btn-primary">
            Transactions
          </Link>
          <Link to="/data/transactions" className="w-64 btn btn-primary">
            Position
          </Link>
        </div>

        <div className="divider">LocalStorage Hooks</div>
        <div className="p-2 flex flex-row flex-wrap gap-4">
          <Link to="/data/symbols" className="w-64 btn btn-primary">
            Symbols
          </Link>
        </div>

        <div className="divider">Indexed Hooks</div>
        <div className="p-2 flex flex-row flex-wrap gap-4">
          <Link to="/TimerData" className="w-64 btn btn-primary">
            CurrentPrice
          </Link>
          <Link to="/TimerData" className="w-64 btn btn-primary">
            CurrentVariance
          </Link>
          <Link to="/TimerData" className="w-64 btn btn-primary">
            OpensForPeriod
          </Link>
          <Link to="/TimerData" className="w-64 btn btn-primary">
            CurrentVolatilityForPeriod
          </Link>
        </div>

        <div className="divider">Filtered Data</div>
        <div className="p-2 flex flex-row flex-wrap gap-4">
          <Link to="/TimerData" className="w-64 btn btn-primary">
            ActiveTrades
          </Link>
          <Link to="/TimerData" className="w-64 btn btn-primary">
            InactiveTrades
          </Link>
        </div>
        <div className="divider">Calculated Data</div>
        <div className="p-2 flex flex-row flex-wrap gap-4">
          <Link to="/TimerData" className="w-64 btn btn-primary">
            ActiveMargins
          </Link>
          <Link to="/TimerData" className="w-64 btn btn-primary">
            CurrentPosition
          </Link>
        </div>
        <div className="divider">Modeled Data</div>
        <div className="p-2 flex flex-row flex-wrap gap-4">
          <Link to="/TimerData" className="w-64 btn btn-primary">
            BlackScholesPricingForSymbolPeriod
          </Link>
          <Link to="/TimerData" className="w-64 btn btn-primary">
            BinomialPricingForSymbolPeriod
          </Link>
        </div>
        <div className="divider">Costing Data</div>
        <div className="p-2 flex flex-row flex-wrap gap-4">
          <Link to="/TimerData" className="w-64 btn btn-primary">
            IndicativeOptionCostForSymbolPeriod
          </Link>
          <Link to="/TimerData" className="w-64 btn btn-primary">
            CurrentOptionCostForSymbolPeriod
          </Link>
          <Link to="/TimerData" className="w-64 btn btn-primary">
            IndicativeContractCostForSymbol
          </Link>
          <Link to="/TimerData" className="w-64 btn btn-primary">
            CurrentContractCostForSymbol
          </Link>
          <Link to="/TimerData" className="w-64 btn btn-primary">
            IndicativeTradeRateForSymbol
          </Link>
          <Link to="/TimerData" className="w-64 btn btn-primary">
            CurrentTradeRateForSymbol
          </Link>
        </div>
        <div className="divider">Analysis Data</div>
        <div className="p-2 flex flex-row flex-wrap gap-4">
          <Link to="/TimerData" className="w-64 btn btn-primary">
            CurrentAnalysisForSymbol
          </Link>
        </div>
      </div>
    </div>
  )
}
