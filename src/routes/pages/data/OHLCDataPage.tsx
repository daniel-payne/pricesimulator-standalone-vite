import useClosesFor from "@/data/indexDB/hooks/useClosesFor"
import useHighsFor from "@/data/indexDB/hooks/useHighsFor"
import useLowsFor from "@/data/indexDB/hooks/useLowsFor"
import useOpensFor from "@/data/indexDB/hooks/useOpensFor"

import DataSparklineDisplay from "@/display/elements/DataSparklineDisplay"
import SymbolSelector from "@/display/controllers/SymbolSelector"

import { useState, type HTMLAttributes, type PropsWithChildren } from "react"
import { Link } from "react-router-dom"

type ComponentProps = {
  name?: string
} & HTMLAttributes<HTMLDivElement>

export default function OHLCDataPage({ name = "OHLCDataPage", ...rest }: PropsWithChildren<ComponentProps>) {
  const [symbol, setSymbol] = useState<string | undefined>("10USY.B")

  const [showJSON, setShowJSON] = useState(false)

  // const markets = useMarkets()

  const opens = useOpensFor(symbol)
  const highs = useHighsFor(symbol)
  const lows = useLowsFor(symbol)
  const closes = useClosesFor(symbol)

  return (
    <div {...rest} data-component={name}>
      <div className="p-2">
        <div className="flex flex-row gap-2 items-center p-2">
          <Link to="/">
            <img src="/pricesimulator-32.png" alt="Home Page" style={{ height: 32, width: 32 }} />
          </Link>
          <h1 className="text-xl text-secondary">OHLC For Symbol Data</h1>
          <button className={`btn btn-sm btn-primary ${showJSON ? "" : "btn-outline"}`} onClick={() => setShowJSON(!showJSON)}>
            json
          </button>
        </div>

        <div className="divider">Symbols</div>

        <div className="flex flex-row gap-2 items-center flex-wrap p-2">
          <SymbolSelector symbol={symbol} onSelectionChanged={setSymbol} />
        </div>

        <div className="divider">Components</div>
        <div className="flex flex-col gap-2 items-start flex-wrap p-2">
          <DataSparklineDisplay className="w-full h-96" data={opens} />
          <DataSparklineDisplay className="w-full h-96" data={highs} />
          <DataSparklineDisplay className="w-full h-96" data={lows} />
          <DataSparklineDisplay className="w-full h-96" data={closes} />
        </div>

        {showJSON && (
          <div>
            <div className="divider">JSON</div>
            <pre className="flex flex-row gap-2 items-center flex-wrap p-2">{JSON.stringify(opens, null, 2)}</pre>
          </div>
        )}
      </div>
    </div>
  )
}
