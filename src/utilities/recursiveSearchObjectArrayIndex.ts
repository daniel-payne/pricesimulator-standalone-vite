export default function recursiveSearchObjectArrayIndex(arr: Array<any>, prop: any, val: any, start = 0, end = arr.length - 1): any {
  const mid = Math.floor((start + end) / 2)

  if (val === arr[mid][prop]) {
    return mid
  }

  if (start >= end) {
    return -1
  }

  return val < arr[mid][prop] 
         ? recursiveSearchObjectArrayIndex(arr, prop, val, start, mid - 1) 
         : recursiveSearchObjectArrayIndex(arr, prop, val, mid + 1, end)
}
