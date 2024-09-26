import ratesLoadFor from "@/data/indexDB/controllers/ratesLoadFor"
import useCurrencies from "@/data/indexDB/hooks/useCurrencies"
// import useClosesFor from "@/data/indexDB/hooks/useClosesFor"
// import useHighsFor from "@/data/indexDB/hooks/useHighsFor"
// import useLowsFor from "@/data/indexDB/hooks/useLowsFor"

import useRatesFor from "@/data/indexDB/hooks/useRatesFor"
import { Currency } from "@/data/indexDB/types/Currency"
import DataSparklineDisplay from "@/display/elements/DataSparklineDisplay"

// import { PriceSummary } from "@/data/indexDB/types/PricingSummary"

import { useState, type HTMLAttributes, type PropsWithChildren } from "react"
import { Link } from "react-router-dom"

type ComponentProps = {
  name?: string
} & HTMLAttributes<HTMLDivElement>

export default function RatesDataPage({ name = "RatesDataPage", ...rest }: PropsWithChildren<ComponentProps>) {
  const [code, setCode] = useState<string | undefined>("USD")

  const [showJSON, setShowJSON] = useState(false)

  const currencies = useCurrencies()

  const rates = useRatesFor(code)

  return (
    <div {...rest} data-component={name}>
      <div className="p-2">
        <div className="flex flex-row gap-2 items-center p-2">
          <Link to="/">
            <img src="/pricesimulator-32.png" alt="Home Page" style={{ height: 32, width: 32 }} />
          </Link>
          <h1 className="text-xl text-secondary">Rates For Code Data</h1>
          <button className={`btn btn-sm btn-primary ${showJSON ? "" : "btn-outline"}`} onClick={() => setShowJSON(!showJSON)}>
            json
          </button>
        </div>

        <div className="divider">Symbols</div>
        <div className="flex flex-row gap-2 items-center flex-wrap p-2">
          {currencies?.map((currency: Currency) => (
            <button
              className={`btn btn-sm btn-primary ${currency.code === code ? "" : "btn-outline"}`}
              onClick={() => setCode(currency.code)}
              key={currency.code}
            >
              {currency.code}
            </button>
          ))}
        </div>

        <div className="divider">Actions</div>
        <div className="flex flex-row gap-2 items-center flex-wrap p-2">
          <button className="btn btn-sm btn-success" disabled={(rates?.length ?? 0) > 0} onClick={() => ratesLoadFor(code)}>
            Load {code}
          </button>
        </div>

        <div className="divider">Components</div>
        <div className="flex flex-col gap-2 items-start flex-wrap p-2">
          <DataSparklineDisplay className="w-full h-96" data={rates} />
        </div>

        {showJSON && (
          <div>
            <div className="divider">JSON</div>
            <pre className="flex flex-row gap-2 items-center flex-wrap p-2">{JSON.stringify(rates, null, 2)}</pre>
          </div>
        )}
      </div>
    </div>
  )
}
