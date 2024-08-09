export default function extractDateFromDay(day: string) {
  return new Date(day).toLocaleDateString("en-UK", {
    year: "numeric",
    month: "short",
    day: "numeric",
  })
}
