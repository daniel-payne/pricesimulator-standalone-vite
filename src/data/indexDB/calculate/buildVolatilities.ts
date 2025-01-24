import { Variances } from "../types/Variances"
import type { Volatilities } from "../types/Volatilities"

import average from "@/utilities/average"
import standardDeviation from "@/utilities/standardDeviation"

const PARKINSON_FACTOR = 1 / Math.sqrt(4 * Math.log(2))
// const GARMIN_KLASS_FACTOR = 3 * Math.log(2) - 1

export default async function calculateVolatilities(variances: Variances, duration: number): Promise<Volatilities> {
  const {
    averageOpenCloses,
    // averageHighLows,

    percentageCloseYesterdays,
    // percentageOpenCloses,
    // percentageHighLows,

    logSquaredHighLows,
    // logSquaredCloseOpens,

    logOpenYesterdays,
    // logHighOpens,
    // logLowOpens,
    logCloseOpens,

    garminKlassValues,
    rogersSatchellValues,
  } = variances

  const length = averageOpenCloses.length + 1

  const overnights = Array(length).fill(undefined)
  const parkinsons = Array(length).fill(undefined)
  const rogersSatchells = Array(length).fill(undefined)
  const garminKlasses = Array(length).fill(undefined)
  const yangZhangs = Array(length).fill(undefined)

  averageOpenCloses.forEach((_, i) => {
    if (i > duration + 1 && averageOpenCloses[i] != null) {
      const yangZhangFactor = 0.34 / (1.34 + (duration + 1) / (duration - 1))

      const percentageCloseYesterdaysSlice = percentageCloseYesterdays.slice(i - duration, i)
      const logSquaredHighLowsSlice = logSquaredHighLows.slice(i - duration, i)
      const garminKlassValuesSlice = garminKlassValues.slice(i - duration, i)

      const logOpenYesterdaysSlice = logOpenYesterdays.slice(i - duration, i)
      const logCloseOpensSlice = logCloseOpens.slice(i - duration, i)

      const rogersSatchellValuesSlice = rogersSatchellValues.slice(i - duration, i)

      const averageLogSquaredHighLowsSlice = average(logSquaredHighLowsSlice)
      const averageGarminKlassValuesSlice = average(garminKlassValuesSlice)
      const averageRogersSatchellValuesSlice = average(rogersSatchellValuesSlice)

      const standardDeviationPercentageCloseYesterdaysSlice = standardDeviation(percentageCloseYesterdaysSlice)
      const standardDeviationLogOpenYesterdaysSlice = standardDeviation(logOpenYesterdaysSlice)
      const standardDeviationLogCloseOpensSlice = standardDeviation(logCloseOpensSlice)

      if (standardDeviationPercentageCloseYesterdaysSlice) {
        overnights[i] = standardDeviationPercentageCloseYesterdaysSlice
      }

      if (averageLogSquaredHighLowsSlice) {
        parkinsons[i] = Math.sqrt(averageLogSquaredHighLowsSlice * PARKINSON_FACTOR)
      }

      if (averageGarminKlassValuesSlice) {
        garminKlasses[i] = Math.sqrt(averageGarminKlassValuesSlice)
      }

      if (averageRogersSatchellValuesSlice) {
        rogersSatchells[i] = Math.sqrt(averageRogersSatchellValuesSlice)
      }

      if (standardDeviationLogOpenYesterdaysSlice && standardDeviationLogCloseOpensSlice && rogersSatchells[i]) {
        yangZhangs[i] = Math.sqrt(
          standardDeviationLogOpenYesterdaysSlice ** 2 +
            (yangZhangFactor * standardDeviationLogCloseOpensSlice) ** 2 +
            (1 - yangZhangFactor) * rogersSatchells[i] ** 2
        )
      }
    }
  })

  const overnightVolatilities = overnights.map((value) => (value == null ? value : value * Math.sqrt(365 / duration)))
  const parkinsonVolatilities = parkinsons.map((value) => (value == null ? value : value * Math.sqrt(365 / duration)))
  const rogersSatchellVolatilities = rogersSatchells.map((value) => (value == null ? value : value * Math.sqrt(365 / duration)))
  const garminKlassVolatilities = garminKlasses.map((value) => (value == null ? value : value * Math.sqrt(365 / duration)))
  const yangZhangVolatilities = yangZhangs.map((value) => (value == null ? value : value * Math.sqrt(365 / duration)))

  const result = {
    overnightVolatilities,
    parkinsonVolatilities,
    rogersSatchellVolatilities,
    garminKlassVolatilities,
    yangZhangVolatilities,
  } as Volatilities

  return result
}
