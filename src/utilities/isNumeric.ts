export default function isNumeric(input: any) {
  if (input == null) {
    return false
  }

  if (input.toString().trim().slice(1) === ".") {
    return false
  }

  if (input.toString().trim().slice(-1) === ".") {
    return false
  }

  return (typeof input === "number" || (typeof input === "string" && input.trim() !== "")) && !isNaN(input as number)
}
