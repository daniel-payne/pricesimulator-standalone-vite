import binarySearch from "@/utilities/binarySearch"

export default async function calculateIndexForTimestamp(timestamps: Array<number>, timestamp: number, indexHint: number | null | undefined = 0) {
  let index: number | undefined

  let doSearch = !!(timestamps != null) && !!(timestamps.length > 0)

  if (doSearch === true && timestamp < timestamps[0]) {
    doSearch = false
  }
  if (doSearch === true && timestamp > timestamps[timestamps.length - 1]) {
    doSearch = false
  }

  if (doSearch) {
    if (indexHint == null) {
      index = binarySearch(timestamps, timestamp)
    } else {
      const indexStart = Math.abs(indexHint)

      const plusOne = timestamps[indexStart + 1]
      const plusTwo = timestamps[indexStart + 2]
      const plusThree = timestamps[indexStart + 3]
      const plusFour = timestamps[indexStart + 4]
      const plusFive = timestamps[indexStart + 5]
      const plusSix = timestamps[indexStart + 6]

      if (timestamp === plusOne) {
        index = indexStart + 1
      } else if (timestamp === plusTwo) {
        index = indexStart + 2
      } else if (timestamp === plusThree) {
        index = indexStart + 3
      } else if (timestamp === plusFour) {
        index = indexStart + 4
      } else if (timestamp === plusFive) {
        index = indexStart + 5
      } else if (timestamp === plusSix) {
        index = indexStart + 6
      } else {
        index = binarySearch(timestamps, timestamp)
      }
    }
  }

  return index
}
