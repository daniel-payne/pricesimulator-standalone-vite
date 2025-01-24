import type { PriceSummary } from "../types/PriceSummary"
import { Volatility } from "../types/Volatility"

export default function extractVolatilityForIndex(
  currentIndex: number,

  overnightVolatilities: Array<number>,
  parkinsonVolatilities: Array<number>,
  rogersSatchellVolatilities: Array<number>,
  garminKlassVolatilities: Array<number>,
  yangZhangVolatilities: Array<number>,

  priceSummary: PriceSummary
) {
  const indexEnd = overnightVolatilities.length - 1

  if (currentIndex > indexEnd) {
    return
  }

  if (priceSummary.firstActiveIndex == null || priceSummary.firstActiveIndex > currentIndex) {
    return
  }

  const symbol = priceSummary.symbol

  const overnightVolatility = overnightVolatilities[currentIndex]
  const parkinsonVolatility = parkinsonVolatilities[currentIndex]
  const rogersSatchellVolatility = rogersSatchellVolatilities[currentIndex]
  const garminKlassVolatility = garminKlassVolatilities[currentIndex]
  const yangZhangVolatility = yangZhangVolatilities[currentIndex]

  const volatility = yangZhangVolatility ?? garminKlassVolatility ?? rogersSatchellVolatility ?? parkinsonVolatility ?? overnightVolatility

  const result = {
    symbol,

    currentIndex,

    overnightVolatility,
    parkinsonVolatility,
    rogersSatchellVolatility,
    garminKlassVolatility,
    yangZhangVolatility,

    volatility,
  } as Volatility

  return result
}
