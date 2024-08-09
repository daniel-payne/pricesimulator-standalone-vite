import { useLiveQuery } from "dexie-react-hooks"

import db from "@/data/indexDB/db"

import type { Timer } from "@/data/indexDB/types/Timer"
import { useEffect } from "react"
import getTimer from "../controllers/get/getTimer"

export default function useTimer(): Timer | undefined {
  const timer = useLiveQuery(async () => {
    return await db.timer?.limit(1).first()
  })

  useEffect(() => {
    if (timer == null) {
      getTimer()
    }
  }, [timer])

  return timer
}
