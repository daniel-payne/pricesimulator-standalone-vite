import { useLiveQuery } from "dexie-react-hooks"

import db from "@/data/indexDB/db"

import type { Market } from "@/data/indexDB/types/Market"
import { useEffect } from "react"

import getMarkets from "../controllers/get/getMarkets"
import compareObjectsBy from "@/utilities/compareObjectsBy"

export default function useMarkets(): Array<Market> | undefined {
  const markets = useLiveQuery(async () => {
    return await db.markets?.toArray()
  })

  useEffect(() => {
    if ((markets?.length ?? 0) < 1) {
      getMarkets()
    }
  }, [markets])

  markets?.sort(compareObjectsBy("displayOrder"))

  return markets
}
