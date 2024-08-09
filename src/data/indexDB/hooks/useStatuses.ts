import { useLiveQuery } from "dexie-react-hooks"

import db from "@/data/indexDB/db"

import type { Status } from "@/data/indexDB/types/Status"

export default function useStatuses(): Array<Status> | undefined {
  const statuses = useLiveQuery(async () => {
    return await db.statuses?.toArray()
  })

  return statuses
}
