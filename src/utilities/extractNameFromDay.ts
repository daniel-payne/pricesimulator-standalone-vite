export default function extractNameFromDay(day: string) {
  return new Date(day).toLocaleDateString("en-UK", { weekday: "long" })
}
