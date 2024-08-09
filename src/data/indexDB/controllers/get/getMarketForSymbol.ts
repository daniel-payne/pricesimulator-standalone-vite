import db from "@/data/indexDB/db"

import type { PriceSimulatorDexie } from "@/data/indexDB/db"

import { controller as getMarkets } from "./getMarkets"
import { Market } from "../../types/Market"

const CACHE: Record<string, Market | undefined | null> = {}

export async function controller(db: PriceSimulatorDexie, symbol: string) {
  if (CACHE[symbol] != null) {
    return CACHE[symbol]
  }

  const markets = await getMarkets(db)

  CACHE[symbol] = markets?.find((market) => market.symbol === symbol)

  return CACHE[symbol]
}

export default function getMarketForSymbol(symbol: string) {
  return controller(db, symbol)
}
