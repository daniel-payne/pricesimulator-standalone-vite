import db from "../db"

import type { PriceSimulatorDexie } from "../db"
import type { Currency } from "../types/Currency"

export async function controller(db: PriceSimulatorDexie, newValues: Partial<Currency> = {}) {
  const collection = await db.currencies.where({ code: newValues.code })
  const currentCurrency = await collection.first()

  if (currentCurrency == null) {
    const updatedCurrency = newValues as Currency
    await db.currencies.add(updatedCurrency)
  } else {
    const updatedCurrency = { ...currentCurrency, ...newValues }
    await collection.modify(updatedCurrency)
  }
}

export default async function currencyUpdate(newValues: Partial<Currency> = {}) {
  return await controller(db, newValues)
}
