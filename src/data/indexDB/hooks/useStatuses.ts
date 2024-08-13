import { useLiveQuery } from "dexie-react-hooks"

import db from "@/data/indexDB/db"

import type { Status } from "@/data/indexDB/types/Status"
import compareObjectsBy from "@/utilities/compareObjectsBy"

export default function useStatuses(): Array<Status> | undefined {
  const statuses = useLiveQuery(async () => {
    return await db.statuses?.toArray()
  })

  statuses?.sort(compareObjectsBy("symbol"))

  return statuses
}
