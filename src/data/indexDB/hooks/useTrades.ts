import compareObjectsBy from "@/utilities/compareObjectsBy"
import { useLiveQuery } from "dexie-react-hooks"
import db from "../db"

export default function useTradeData() {
  const data = useLiveQuery(async () => {
    return await db.trades?.toArray()
  })

  data?.sort(compareObjectsBy("displayOrder"))

  return data
}
