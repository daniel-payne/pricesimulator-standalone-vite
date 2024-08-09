export default function formatTimestampDay(timestamp: number | string | undefined | null) {
  if (timestamp == null) {
    return null
  }

  return new Date(timestamp).toLocaleDateString(undefined, {
    weekday: "short",
  })
}
