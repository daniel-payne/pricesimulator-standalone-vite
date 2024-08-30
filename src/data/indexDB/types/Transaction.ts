export type Transaction = {
  reference: string
  index: number

  value: number
  source: string

  description?: string

  [index: string]: any
}
