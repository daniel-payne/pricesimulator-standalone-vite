import { TradeDirection } from "../enums/TradeDirection"
import { TradeStatus } from "../enums/TradeStatus"

export type Trade = {
  id: string
  no: number

  status: TradeStatus
  symbol: string
  size?: number
  amount: number
  direction: TradeDirection
  expiryTimestamp?: number

  entryValue?: number
  entryPrice?: number
  entryCost?: number
  entryTimestamp?: number

  exitPrice?: number
  exitCost?: number
  exitTimestamp?: number

  exitDifference?: number
  exitPercent?: number
  profit?: number

  [index: string]: any
}
