import { useQueryState } from "@keldan-systems/state-mutex"

import usePrices from "@/data/indexDB/hooks/usePrices"

import type { HTMLAttributes, PropsWithChildren } from "react"
import { Link } from "react-router-dom"
import formatTimestamp from "@/utilities/formatTimestamp"
import { Price } from "@/data/indexDB/types/Price"

type ComponentProps = {
  name?: string
} & HTMLAttributes<HTMLDivElement>

export default function PricesPage({ name = "PricesPage", ...rest }: PropsWithChildren<ComponentProps>) {
  const [showJson, setShowJson] = useQueryState<boolean>("showJson", false)

  const prices = usePrices()

  return (
    <div {...rest} data-component={name}>
      <div className="flex flex-col gap-2 p-3">
        <div className="flex flex-row flex-wrap gap-2 items-center">
          <Link to="/" className="btn btn-primary btn-sm mx-2">
            Home
          </Link>
          <div className="text-secondary text-2xl font-bold">Prices</div>
          <button className="btn btn-primary btn-ghost btn-sm" onClick={() => setShowJson(!showJson)}>
            json
          </button>
        </div>
        <div className="flex-auto flex flex-row flex-wrap gap-0">
          {prices?.map((price) => (
            <PriceDisplay price={price} showJson={showJson} />
          ))}
        </div>
      </div>
    </div>
  )
}

export const PriceDisplay = ({ price, showJson = false }: { price?: Price; showJson?: boolean | undefined | null }) => {
  if (price == null) return null

  return (
    <div className="w-1/6 p-2" key={price.symbol}>
      <div className="w-full h-full border border-primary rounded-xl p-2 overflow-hidden">
        <div className="text-primary text-xl font-bold">{price.symbol}</div>
        {showJson && <pre>{JSON.stringify(price, null, 2)}</pre>}
        <div className="text-secondary font-bold">{formatTimestamp(price?.currentTimestamp)}</div>
        <div className="text-secondary">{price?.isMarketClosed ? "CLOSED" : "open"}</div>
        <div className="text-secondary">{price?.priorClose}</div>
        <div className="text-secondary">
          {price?.currentOpen} - {price?.currentHigh} / {price?.currentLow} - {price?.currentClose}
        </div>
        {/* <div className="text-secondary font-bold">
        {market?.contractSize} {market?.contractUnit}&nbsp;
      </div>
      <div className="text-secondary">{market?.contractName}&nbsp;</div>   */}
      </div>
    </div>
  )
}
