import toNumeric from "./toNumeric"

export default function formatValue(input: number | undefined | null, showCents = false, currency = "USD", decimalPlaces = 2) {
  if (input == null) return ""

  const number = toNumeric(input) ?? 0

  if (number === 0) {
    return showCents ? "0.00" : "0"
  }

  const digits = showCents ? decimalPlaces : 0

  return number.toLocaleString("en-US", {
    currency,
    style: "currency",
    currencyDisplay: "symbol",
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  })
}
