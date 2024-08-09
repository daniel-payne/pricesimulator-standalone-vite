export default function dateFormatter(data: any) {
  return new Date(data).toISOString().split("T")[0]
}
