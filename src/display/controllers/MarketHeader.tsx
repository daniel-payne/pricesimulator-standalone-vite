import { Market } from "@/data/indexDB/types/Market"
import type { HTMLAttributes, PropsWithChildren } from "react"
import MarketNameDescription from "../components/MarketNameDescription"
import MarketBehaviors from "../components/MarketBehaviors"
import useBehaviorsSelection from "@/data/localStorage/hooks/useBehaviorsSelection"
import useFavorites from "@/data/localStorage/hooks/useFavorites"

type ComponentProps = {
  market: Market

  name?: string
} & HTMLAttributes<HTMLDivElement>

export default function MarketHeader({ market, name = "MarketHeader", ...rest }: PropsWithChildren<ComponentProps>) {
  const behaviors = useBehaviorsSelection()
  const favorites = useFavorites()

  const isFavorite = favorites?.includes(market?.symbol)

  return (
    <div {...rest} data-controller={name}>
      <div className="h-full w-full flex flex-row justify-between ">
        <MarketNameDescription className="truncate pe-2" market={market} />
        {behaviors === "on" && <MarketBehaviors market={market} isFavorite={isFavorite} />}
      </div>
    </div>
  )
}
