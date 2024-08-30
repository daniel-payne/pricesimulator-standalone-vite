const DAYS = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"]

function getLastDayOccurrence(date: Date, day: string) {
  const lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0)

  const d = new Date(lastDay.getTime())

  if (DAYS.includes(day)) {
    const modifier = (d.getDay() + DAYS.length - DAYS.indexOf(day)) % 7 || 7
    d.setDate(d.getDate() - modifier)
  }

  return d
}

export default function lastDateOfMonth(currentDate: number | Date | string | null | undefined, dayOfWeek: string = "MON", addMonths: number = 0) {
  if (currentDate == null) {
    return undefined
  }

  const futureDate = new Date(currentDate)

  futureDate.setMonth(futureDate.getMonth() + addMonths)

  return getLastDayOccurrence(futureDate, dayOfWeek)
}
