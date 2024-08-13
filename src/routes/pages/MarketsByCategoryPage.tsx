import { useQueryState } from "@keldan-systems/state-mutex"

import useMarketsByCategory from "@/data/indexDB/hooks/useMarketsByCategory"

import type { HTMLAttributes, PropsWithChildren } from "react"
import { Link } from "react-router-dom"

type ComponentProps = {
  name?: string
} & HTMLAttributes<HTMLDivElement>

export default function MarketsByCategoryPage({ name = "MarketsByCategoryPage", ...rest }: PropsWithChildren<ComponentProps>) {
  const [showJson, setShowJson] = useQueryState<boolean>("showJson", false)

  const categories = useMarketsByCategory()

  return (
    <div {...rest} data-component={name}>
      <div className="flex flex-col gap-2 p-3">
        <div className="flex flex-row flex-wrap gap-2 items-center">
          <Link to="/" className="btn btn-primary btn-sm mx-2">
            Home
          </Link>
          <div className="text-secondary text-2xl font-bold">MarketsByCategory</div>
          <button className="btn btn-primary btn-ghost btn-sm" onClick={() => setShowJson(!showJson)}>
            json
          </button>
        </div>
        <div className="flex-auto flex flex-row flex-wrap gap-0">
          {categories?.map((category) => {
            return (
              <div className="w-96 p-2" key={category.name}>
                <div className="w-full h-full border border-primary rounded-xl p-2 overflow-hidden">
                  <div className="text-primary text-xl font-bold">{category.name}</div>
                  {showJson && <pre>{JSON.stringify(category, null, 2)}</pre>}
                  <div className="text-secondary font-bold">{category?.description}&nbsp;</div>
                  <div className="text-secondary">{category?.markets.map((market) => market.name).join(", ")}&nbsp;</div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
