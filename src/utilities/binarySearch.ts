export default function binarySearch<T>(sortedArray: Array<T>, target: T) {
  let left = 0
  let right = sortedArray.length - 1

  while (left <= right) {
    const mid = Math.floor((left + right) / 2)

    if (sortedArray[mid] === target) {
      // found the target
      return mid
    } else if (sortedArray[mid] < target) {
      // continue searching to the right
      left = mid + 1
    } else {
      // search searching to the left
      right = mid - 1
    }
  }

  // target not found
  return -1 * left
}
