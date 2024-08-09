import { differenceInDays, differenceInWeeks, differenceInMonths, differenceInYears } from "date-fns"

export default function differenceInTimestamps(
  firstTimestamp: number | string | undefined | null,
  secondTimestamp: number | string | undefined | null,
  period: "days" | "weeks" | "months" | "years" = "days"
) {
  if (firstTimestamp == null || secondTimestamp == null) {
    return null
  }

  const firstDate = new Date(firstTimestamp)
  const secondDate = new Date(secondTimestamp)

  let result

  if (period === "days") {
    result = differenceInDays(firstDate, secondDate)
  } else if (period === "weeks") {
    result = differenceInWeeks(firstDate, secondDate)
  } else if (period === "months") {
    result = differenceInMonths(firstDate, secondDate)
  } else if (period === "years") {
    result = differenceInYears(firstDate, secondDate)
  }

  return result
}
