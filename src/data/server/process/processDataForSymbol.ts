const DAYS = 1000 * 60 * 60 * 24

export default async function processDataForSymbol(symbol: string, data: any) {
  const trend = structuredClone(data)

  trend.symbol = symbol

  trend.timegaps = trend.timestamps.map((timestamp: number, index: number) => {
    if (index === 0) {
      return null
    }

    return (timestamp - trend.timestamps[index - 1]) / DAYS
  })

  trend.interdays = trend.timestamps.map((_: any, index: number) => {
    return trend.highs[index] - trend.lows[index]
  })

  for (let i = trend.timestamps.length - 1; i > 0; i--) {
    if (trend.timegaps[i] <= 5) {
      trend.firstActiveTimestamp = trend.timestamps[i]
    } else if (i === 0) {
      trend.firstActiveTimestamp = trend.timestamps[i]
    }
    if (trend.interdays[i] > 0 && trend.firstActiveTimestamp != null) {
      trend.firstInterdayTimestamp = trend.timestamps[i]
    }
  }

  return trend
}
