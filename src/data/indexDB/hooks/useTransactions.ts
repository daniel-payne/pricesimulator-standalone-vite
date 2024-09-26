import compareObjectsBy from "@/utilities/compareObjectsBy"
import { useLiveQuery } from "dexie-react-hooks"
import db from "../db"

export default function useTransactions() {
  const data = useLiveQuery(async () => {
    return await db.transactions?.toArray()
  })

  data?.sort(compareObjectsBy("index"))

  return data
}
