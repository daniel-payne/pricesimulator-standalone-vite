export type Index = {
  symbol: string

  isMarketActive: boolean
  isMarketOpen: boolean

  currentPosition?: number
  currentTimestamp?: number
  currentDay?: string
}
