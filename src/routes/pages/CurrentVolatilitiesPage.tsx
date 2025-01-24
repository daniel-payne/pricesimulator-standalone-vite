import { useQueryState } from "@keldan-systems/state-mutex"

import type { HTMLAttributes, PropsWithChildren } from "react"
import { Link } from "react-router-dom"

import useCurrentVolatilities from "@/data/indexDB/hooks/useCurrentVolatilities"
import type { Volatility } from "@/data/indexDB/types/Volatility"

type ComponentProps = {
  name?: string
} & HTMLAttributes<HTMLDivElement>

export default function CurrentVolatilitiesPage({ name = "CurrentVolatilitiesPage", ...rest }: PropsWithChildren<ComponentProps>) {
  const [showJson, setShowJson] = useQueryState<boolean>("showJson", false)

  const volatilities = useCurrentVolatilities()

  return (
    <div {...rest} data-component={name}>
      <div className="flex flex-col gap-2 p-3">
        <div className="flex flex-row flex-wrap gap-2 items-center">
          <Link to="/" className="btn btn-primary btn-sm mx-2">
            Home
          </Link>
          <div className="text-secondary text-2xl font-bold">Current Volatilities</div>
          <button className="btn btn-primary btn-ghost btn-sm" onClick={() => setShowJson(!showJson)}>
            json
          </button>
        </div>
        <div className="flex-auto flex flex-row flex-wrap gap-0">
          {volatilities?.map((volatility) => (
            <VolatilityDisplay volatility={volatility} showJson={showJson} />
          ))}
        </div>
      </div>
    </div>
  )
}

export const VolatilityDisplay = ({ volatility, showJson = false }: { volatility?: Volatility; showJson?: boolean | undefined | null }) => {
  if (volatility == null) return null

  return (
    <div className="w-96 p-2" data-name="MarketDisplay" key={volatility.symbol}>
      <div className="w-full h-full border border-primary rounded-xl p-2 overflow-hidden">
        <div className="text-primary text-xl font-bold">{volatility.symbol}</div>
        {showJson && <pre>{JSON.stringify(volatility, null, 2)}</pre>}
        <div className="text-secondary font-bold">{volatility["90"].volatility} </div>
        {/* <div className="text-secondary">{price?.description}&nbsp;</div>
        <div className="text-secondary font-bold">
          {market?.contractSize} {market?.contractUnit}&nbsp;
        </div>
        // <div className="text-secondary">{market?.contractName}&nbsp;</div> */}
      </div>
    </div>
  )
}
