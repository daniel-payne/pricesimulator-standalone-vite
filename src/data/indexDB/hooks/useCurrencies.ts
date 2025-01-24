import { useLiveQuery } from "dexie-react-hooks"

import db from "@/data/indexDB/db"

import compareObjectsBy from "@/utilities/compareObjectsBy"

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export default function useCurrencies() {
  const currencies = useLiveQuery(async () => {
    return await db.currencies?.toArray()
  })

  currencies?.sort(compareObjectsBy("code"))

  return currencies ?? []
}
