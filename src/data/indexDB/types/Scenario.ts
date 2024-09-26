export type Scenario = {
  ref: string
  name: string
  description?: string

  symbols: Array<string>

  [index: string]: any
}
