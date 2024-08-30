import toNumeric from "./toNumeric"

function round(precision: number, number: number) {
  if (precision > 0) {
    return parseFloat(number.toPrecision(precision))
  }

  return Math.round(number)
}

export default function formatNumber(input: number | undefined | null, precision: number = 6) {
  if (input == null) return ""

  const number = toNumeric(input) ?? 0

  if (input === 0) return "0"

  const roundedValue = round(precision, number)
  const floorValue = Math.floor(roundedValue)

  const isInteger = Math.abs(floorValue - roundedValue) < Number.EPSILON

  const numberOfFloorDigits = String(floorValue).length
  const numberOfDigits = String(roundedValue).length

  if (numberOfFloorDigits > precision) {
    return String(floorValue)
  } else if (precision > 0) {
    const padding = isInteger ? precision - numberOfFloorDigits : precision - numberOfDigits + 1

    if (padding > 0) {
      if (isInteger) {
        return `${String(floorValue)}.${"0".repeat(padding)}`
      } else {
        return `${String(roundedValue)}${"0".repeat(padding)}`
      }
    } else {
      return String(roundedValue)
    }
  }
}
