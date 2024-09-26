import { Market } from "@/data/indexDB/types/Market"
import type { HTMLAttributes, PropsWithChildren } from "react"

import YesterdayMovementDisplay from "../components/YesterdayMovementDisplay"
import CurrentOpenDisplay from "../components/CurrentOpenDisplay"
import { Price } from "@/data/indexDB/types/Price"

type ComponentProps = {
  market: Market
  price?: Price | null | undefined

  name?: string
} & HTMLAttributes<HTMLDivElement>

export default function MarketFooter({ market, price, name = "MarketFooter", ...rest }: PropsWithChildren<ComponentProps>) {
  const hasNoPrices = price == null
  const hasPrices = !hasNoPrices

  // const actions = useActionsSelection()

  return (
    <div {...rest} data-controller={name}>
      <div className="h-full w-full flex flex-row justify-between ">
        <div className="flex flex-row justify-between items-center gap-2">
          {hasPrices && (
            <>
              <YesterdayMovementDisplay price={price} />
              <CurrentOpenDisplay market={market} price={price} />
            </>
          )}
          {hasNoPrices && <div className="text-xs text-secondary opacity-50">Market Not Active</div>}
        </div>
      </div>
    </div>
  )
}
