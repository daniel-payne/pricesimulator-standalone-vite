const CONVERT_INDEX_TO_PROPERTIES = /\[(\w+)\]/g
const LEADING_DOT = /^\./

export default function pluck(input: any, path: string) {
  var matches = path.replace(CONVERT_INDEX_TO_PROPERTIES, ".$1").replace(LEADING_DOT, "").split(".")

  let output = input

  for (var i = 0, n = matches.length; i < n; ++i) {
    var match = matches[i]

    if (match in output) {
      output = output[match]
    } else {
      return
    }
  }

  return output
}
