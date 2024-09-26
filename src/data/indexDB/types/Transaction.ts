export type Transaction = {
  id: string
  index: number

  value: number
  source: string

  description?: string
  reference?: string

  [index: string]: any
}
