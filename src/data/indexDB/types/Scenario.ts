export type Scenario = {
  id: number
  name: string
  description?: string

  symbols: Array<string>

  [index: string]: any
}
