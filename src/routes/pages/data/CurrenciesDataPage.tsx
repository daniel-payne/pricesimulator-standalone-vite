import currenciesLoadAll from "@/data/indexDB/controllers/currenciesLoadAll"
import ratesLoadFor from "@/data/indexDB/controllers/ratesLoadFor"
// import pricingLoadAll from "@/data/indexDB/controllers/pricingLoadAll"
import useCurrencies from "@/data/indexDB/hooks/useCurrencies"
import CurrencyDetails from "@/display/components/CurrencyDetails"
// import useMarkets from "@/data/indexDB/hooks/useMarkets"

// import usePricings from "@/data/indexDB/hooks/usePricings"
// import PricingDetails from "@/display/components/PricingDetails"

// import { PriceSummary } from "@/data/indexDB/types/PricingSummary"

import { useState, type HTMLAttributes, type PropsWithChildren } from "react"
import { Link } from "react-router-dom"

type ComponentProps = {
  name?: string
} & HTMLAttributes<HTMLDivElement>

export default function CurrenciesDataPage({ name = "CurrenciesDataPage", ...rest }: PropsWithChildren<ComponentProps>) {
  // const [symbol, setSymbol] = useState<string | undefined>()

  const [showJSON, setShowJSON] = useState(false)

  const currencies = useCurrencies()

  return (
    <div {...rest} data-component={name}>
      <div className="p-2">
        <div className="flex flex-row gap-2 items-center p-2">
          <Link to="/">
            <img src="/pricesimulator-32.png" alt="Home Page" style={{ height: 32, width: 32 }} />
          </Link>
          <h1 className="text-xl text-secondary">Currencies Data</h1>
          <button className={`btn btn-sm btn-primary ${showJSON ? "" : "btn-outline"}`} onClick={() => setShowJSON(!showJSON)}>
            json
          </button>
        </div>

        <div className="divider">Actions</div>
        <div className="flex flex-row gap-2 items-center flex-wrap p-2">
          <button className="btn btn-sm btn-success" onClick={() => currenciesLoadAll()}>
            Reload
          </button>
          <button className="btn btn-sm btn-success" onClick={() => ratesLoadFor("USD")}>
            Load USD Data
          </button>
        </div>

        <div className="divider">Components</div>
        <div className="flex flex-row gap-2 items-center flex-wrap p-2">
          {currencies?.map((currency: any) => (
            <CurrencyDetails currency={currency} key={currency.code} />
          ))}
        </div>

        {showJSON && (
          <div>
            <div className="divider">JSON</div>
            <pre className="flex flex-row gap-2 items-center flex-wrap p-2">{JSON.stringify(currencies, null, 2)}</pre>
          </div>
        )}
      </div>
    </div>
  )
}
