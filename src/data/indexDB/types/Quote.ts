import generateID from "@/utilities/generateID"
import { OptionDirection } from "../enums/OptionDirection"
import { OptionType } from "../enums/OptionType"
import { QuoteStatus } from "../enums/QuoteStatus"
import { QuoteType } from "../enums/QuoteType"
import { TradeDirection } from "../enums/TradeDirection"
import { OptionChoice } from "../enums/OptionChoice"

type TradeRFQ = {
  direction: TradeDirection
  expiryTimestamp?: number
  takeProfit?: number
  stopLoss?: number
}

type OptionRFQ = {
  optionDirection: OptionDirection
  optionChoice: OptionChoice
  optionType: OptionType

  strikeDelta?: number
  strikeValue?: number

  expiryTimestamp?: number
}

export type Quote = {
  id: string

  quoteType: QuoteType
  quoteStatus: QuoteStatus

  symbol: string
  amount: number

  tradeRFQ?: TradeRFQ

  primaryOptionRFQ?: OptionRFQ
  secondaryOptionRFQ?: OptionRFQ
  tertiaryOptionRFQ?: OptionRFQ
  quaternaryOptionRFQ?: OptionRFQ

  tradePrice?: number

  primaryOptionCost?: number
  secondaryOptionCost?: number
  tertiaryOptionCost?: number
  quaternaryOptionCost?: number

  tradeId?: string

  primaryOptionId?: string
  secondaryOptionId?: string
  tertiaryOptionId?: string
  quaternaryOptionId?: string

  [index: string]: any
}

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const generateCoveredTradeQuote = (
  symbol: string,
  amount: number,
  direction: TradeDirection,
  expiryTimestamp: number,
  strikeDelta: number,
  takeProfit?: number | undefined,
  stopLoss?: number | undefined,
  optionType = OptionType.European
) => {
  return {
    id: generateID(),
    symbol,
    amount,
    quoteType: QuoteType.CoveredTrade,
    quoteStatus: QuoteStatus.Prepared,
    tradeRFQ: {
      direction: direction,
      takeProfit: takeProfit,
      stopLoss: stopLoss,
      expiryTimestamp: expiryTimestamp,
    },
    primaryOptionRFQ: {
      optionType,
      optionDirection: OptionDirection.Buy,
      tradeDirection: direction === TradeDirection.Call ? TradeDirection.Put : TradeDirection.Call,
      strikeDelta: strikeDelta,
      expiryTimestamp: expiryTimestamp,
    },
  }
}

export const generateVanillaOptionQuote = (
  symbol: string,
  amount: number,
  optionDirection: OptionDirection,
  tradeDirection: TradeDirection,
  optionType: OptionType,
  expiryTimestamp?: number | undefined,
  strikeDelta?: number | undefined,
  strikeValue?: number | undefined
) => {
  if (strikeDelta == null && strikeValue == null) {
    throw "Need to enter a strike delta or value"
  }

  return {
    id: generateID(),
    symbol,
    amount,
    quoteType: QuoteType.Vanilla,
    quoteStatus: QuoteStatus.Prepared,
    primaryOptionRFQ: {
      optionType,
      optionDirection,
      tradeDirection,
      strikeDelta: strikeDelta,
      strikeValue: strikeValue,
      expiryTimestamp: expiryTimestamp,
    },
  }
}
