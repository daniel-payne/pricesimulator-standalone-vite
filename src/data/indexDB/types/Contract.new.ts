import type { Trade } from "@/data/indexDB/types/Trade"
import type { Option } from "@/data/indexDB/types/Option.new"

import type { ContractType } from "@/data/indexDB/enums/ContractType"
import type { ContractStatus } from "@/data/indexDB/enums/ContractStatus"

export type Contract = {
  symbol: string
  type: ContractType
  status: ContractStatus

  trade?: Trade | undefined

  primaryOption?: Option | undefined
  secondaryOption?: Option | undefined
  tertiaryOption?: Option | undefined
  quaternaryOption?: Option | undefined

  tradeProfit?: number
  primaryOptionProfit?: number
  secondaryOptionProfit?: number
  tertiaryOptionProfit?: number
  quaternaryOptionProfit?: number

  totalProfit?: number

  [key: string]: any
}
