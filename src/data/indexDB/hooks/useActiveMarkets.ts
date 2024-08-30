import { useLiveQuery } from "dexie-react-hooks"

import db from "@/data/indexDB/db"

import type { Market } from "@/data/indexDB/types/Market"

import compareObjectsBy from "@/utilities/compareObjectsBy"

export default function useActiveMarkets(): Array<Market> | undefined {
  const markets = useLiveQuery(async () => {
    return await db.markets?.toArray()
  })

  const currentPrices = useLiveQuery(async () => {
    return await db.currentPrices?.toArray()
  })

  const activeMarkets = markets?.filter((market) => {
    const matchedPrice = currentPrices?.find((price) => price.symbol === market.symbol)

    return matchedPrice != null
  })

  activeMarkets?.sort(compareObjectsBy("displayOrder"))

  return activeMarkets
}
