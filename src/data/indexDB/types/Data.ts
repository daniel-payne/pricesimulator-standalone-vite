export type Data = {
  symbol: string

  timestamps?: Array<number> | undefined | null
  opens?: Array<number> | undefined | null
  highs?: Array<number> | undefined | null
  lows?: Array<number> | undefined | null
  closes?: Array<number> | undefined | null

  count?: number | undefined | null

  firstActiveTimestamp?: number | undefined | null
  firstInterdayTimestamp?: number | undefined | null
}
