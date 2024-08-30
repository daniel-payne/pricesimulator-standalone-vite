export type Balance = {
  guid: string

  currentIndex: number
  transactionBalance: number
  marginBalance: number
  availableBalance: number

  [index: string]: any
}
