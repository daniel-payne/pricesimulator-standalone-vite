import { useLiveQuery } from "dexie-react-hooks"

import db from "@/data/indexDB/db"

import type { Data } from "@/data/indexDB/types/Data"

export default function useData(): Array<Data> | undefined {
  const data = useLiveQuery(async () => {
    return await db.data?.toArray()
  })

  return data
}
