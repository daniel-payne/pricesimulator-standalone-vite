export type Volatility = {
  symbol: string

  currentIndex: number

  overnightVolatility: number
  parkinsonVolatility: number
  rogersSatchellVolatility: number
  garminKlassVolatility: number
  yangZhangVolatility: number

  volatility: number

  [index: string]: any
}
