export default function onlyInLeftArray(left: any, right: any, property: string) {
  const isSameData = (a: any, b: any) => a[property] === b[property] && a[property] === b[property]

  const result = left.filter((leftValue: any) => {
    return !right.some((rightValue: any) => {
      return isSameData(leftValue, rightValue)
    })
  })

  return result
}
