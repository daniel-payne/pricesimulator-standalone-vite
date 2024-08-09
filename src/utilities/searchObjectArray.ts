 
import binarySearchObjectArrayIndex from "./binarySearchObjectArrayIndex"


export default function searchObjectArray<T>(array: Array<T>, parameter: string, target: undefined | string | number): T | undefined {
  if (!target || array.length === 0) {
    return undefined
  }

  const index = binarySearchObjectArrayIndex(array, parameter, target)

  if (index >= 0) {
    return array[index]
  }

  return undefined
}
