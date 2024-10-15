import { useLiveQuery } from "dexie-react-hooks"

import db from "@/data/indexDB/db"
import { TradeStatus } from "../enums/TradeStatus"
import useTransactions from "./useTransactions"
import useVariationMargins from "./useVariationMargins"
import useActiveTrades from "./useActiveTrades"
import { INITIAL_MARGIN_REQUIREMENT } from "../constants/INITIAL_MARGIN_REQUIREMENT"
import { useEffect, useState } from "react"
import balanceCalculate from "../controllers/balanceCalculate"
import useTimer from "./useTimer"

export default function useBalance(): any | undefined {
  const [balance, setBalance] = useState<any>()

  const timer = useTimer()

  useEffect(() => {
    const run = async () => {
      const newBalance = await balanceCalculate()

      setBalance(newBalance)
    }

    run()
  }, [timer])

  return balance ?? {}
}
