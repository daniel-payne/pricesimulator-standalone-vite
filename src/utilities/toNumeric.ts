import isNumeric from "./isNumeric"

export default function toNumeric(input: any) {
  try {
    if (isNumeric(input)) {
      return parseFloat(input.toString().trim())
    }
  } catch (e) {
    return null
  }

  return null
}
