export default function formatTimestamp(timestamp: number | string | undefined | null) {
  if (timestamp == null) {
    return null
  }

  return new Date(timestamp).toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  })
}
