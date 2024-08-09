import { useLiveQuery } from "dexie-react-hooks"

import db from "@/data/indexDB/db"

import compareObjectsBy from "@/utilities/compareObjectsBy"

import type { Margin } from "@/data/indexDB/types/Margin"

export default function UseMargins(): Array<Margin> | undefined {
  const margins = useLiveQuery(async () => {
    return await db.margins?.toArray()
  })

  margins?.sort(compareObjectsBy("symbol"))

  return margins
}
