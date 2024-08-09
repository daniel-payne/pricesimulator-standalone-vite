export default function formatTimestampISO(timestamp: number | string | undefined | null) {
  if (timestamp == null) {
    return null
  }

  return new Date(timestamp).toISOString().substring(0, 10)
}
