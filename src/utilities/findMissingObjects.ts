import onlyInLeftArray from "./onlyInLeftArray"

export default function findMissingObjects(left: any, right: any, property: string) {
  const onlyInA = onlyInLeftArray(left, right, property)
  const onlyInB = onlyInLeftArray(right, left, property)

  const result = [...onlyInA, ...onlyInB ]

  return result
}
