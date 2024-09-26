import { Market } from "@/data/indexDB/types/Market"
import type { HTMLAttributes, PropsWithChildren } from "react"

type ComponentProps = {
  market: Market
  name?: string
} & HTMLAttributes<HTMLDivElement>

export default function MarketNameDescription({ market, name = "MarketNameDescription", ...rest }: PropsWithChildren<ComponentProps>) {
  const showDescription = market.description.length > 0 // && market.name.length <= 7

  return (
    <div {...rest} data-component={name}>
      <div className="truncate">
        <span className="text-xl font-semibold text-primary">{market.name}</span>
        {showDescription && <span className="ps-2 text-secondary text-sm"> {market.description}</span>}
      </div>
    </div>
  )
}
