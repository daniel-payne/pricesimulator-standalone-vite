import { useLiveQuery } from "dexie-react-hooks"

import db from "@/data/indexDB/db"

import compareObjectsBy from "@/utilities/compareObjectsBy"

import type { Margin } from "@/data/indexDB/types/Margin"

export default function UseCurrentMargins(): Array<Margin> | undefined {
  const currentMargins = useLiveQuery(async () => {
    return await db.currentMargins?.toArray()
  })

  currentMargins?.sort(compareObjectsBy("symbol"))

  return currentMargins
}
