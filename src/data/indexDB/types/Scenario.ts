export type Scenario = {
  id: number
  name: string
  description?: string

  contractTypeSettings?: {
    options?: Array<string>
  }

  contractNotionalSettings?: {
    isTradingContracts?: boolean
    isReadonly?: boolean
    defaultValue?: number
  }

  canUseStopLoss?: boolean
  canUseTakeProfit?: boolean
  canCoverTrade?: boolean

  symbols: Array<string>

  [index: string]: any
}
