export default function binarySearchObjectArrayIndex(arr: Array<any>, prop: any, val: any): number {
  let start = 0
  let end = arr.length - 1

  while (start <= end) {
    const mid = Math.floor((start + end) / 2)

    if (arr[mid][prop] === val) {
      return mid
    }

    if (val < arr[mid][prop]) {
      end = mid - 1
    } else {
      start = mid + 1
    }
  }
  return -1
}
