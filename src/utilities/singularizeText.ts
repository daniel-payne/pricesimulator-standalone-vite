export default function singularizeText(word: string | undefined) {
  if (word == null || word.length === 0) {
    return ""
  }

  const endings: any = {
    ves: "fe",
    ies: "y",
    i: "us",
    zes: "ze",
    ses: "s",
    es: "e",
    s: "",
  }

  return word.replace(new RegExp(`(${Object.keys(endings).join("|")})$`), (r) => endings[r])
}
