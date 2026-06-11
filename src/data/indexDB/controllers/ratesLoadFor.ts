import Papa from "papaparse"

import db from "@/data/indexDB/db"

import type { PriceSimulatorDexie } from "@/data/indexDB/db"
import currencyUpdate from "./currencyUpdate"

const TIMEGAP_CUTOFF = 10


const csvToObjectForRates = (item: any) => {
  if (!item["date"]) {
    return
  }

  const date = item["date"]

  const index = Math.floor(new Date(date).getTime() / 1000 / 60 / 60 / 24)

  const data = {
    date,
    index,
    value: Number.parseFloat(item["value"]),
  } as any

  return data
}

import consoleInfo from "@/utilities/consoleInfo"

export async function controller(db: PriceSimulatorDexie, code: string | undefined) {
  consoleInfo(`ratesLoadFor: controller started for code = ${code}`)
  if (code == null) {
    consoleInfo("ratesLoadFor: code is null/undefined, returning early")
    return
  }

  consoleInfo(`ratesLoadFor: checking ratesCache for ${code}...`)
  if (db.ratesCache != null && db.ratesCache[code] != null && db.ratesCache[code].length > 0) {
    consoleInfo(`ratesLoadFor: cache found for ${code}, returning early`)
    return
  }

  consoleInfo(`ratesLoadFor: querying db for count of rates for ${code}...`)
  const count = await db.rates.where({ code }).count()
  consoleInfo(`ratesLoadFor: count = ${count}`)

  if (count > 0) {
    consoleInfo(`ratesLoadFor: count > 0, loading stored rates for ${code} into cache`)
    const savedRates = await db.rates.where({ code }).first()

    db.ratesCache[code] = savedRates?.data

    return
  }

  consoleInfo(`ratesLoadFor: code ${code} not in cache/db. Fetching metadata from db.currencies...`)
  const currency = await db.currencies.get(code)
  consoleInfo(`ratesLoadFor: retrieved currency metadata from db for ${code}`, currency)

  if (currency?.code == null) {
    consoleInfo(`ratesLoadFor: currency code for ${code} not found in db.currencies!`)
    return
  }

  consoleInfo(`ratesLoadFor: deleting any partial rates for ${code}...`)
  await db.rates.where({ code }).delete()

  const url = `/rates/${currency?.code}.csv`
  consoleInfo(`ratesLoadFor: fetching rates file from ${url}...`)
  const response = await fetch(url, {})
  consoleInfo(`ratesLoadFor: fetch response status = ${response.status}, ok = ${response.ok}`)

  if (response.ok === false) {
    consoleInfo(`ratesLoadFor: fetch failed for ${code}. status text: ${response.statusText}`)
    return { error: response.statusText }
  }

  const csv = await response.text()
  consoleInfo(`ratesLoadFor: csv text length = ${csv.length}`)

  const json = Papa.parse(csv, { header: true })
  consoleInfo(`ratesLoadFor: parsed csv rows count = ${json.data?.length}`)

  const rates = json.data
    .map(csvToObjectForRates)
    .filter((item: any) => item?.value)
    .filter((item) => item.index >= 0)
  consoleInfo(`ratesLoadFor: filtered rates count = ${rates.length}`)

  const interestRates = { code, data: Array(20000).fill(undefined) }

  for (const rate of rates) {
    const index = rate.index

    interestRates.data[index] = rate.value
  }

  let firstActiveIndex: number | null = null

  let lastActiveIndex: number | null = null

  let daysSincePrice = 0
  let timeGapFound = false
  let dataStarted = false
  let rateCount = 0

  for (let i = interestRates.data?.length - 1; i >= 0; i--) {
    if (timeGapFound === false) {
      const rate = interestRates.data[i]

      if (rate == null) {
        daysSincePrice++
      } else {
        dataStarted = true

        rateCount += 1

        if (lastActiveIndex == null) {
          lastActiveIndex = i
        }

        firstActiveIndex = i
        daysSincePrice = 0
      }

      if (dataStarted == true && daysSincePrice >= TIMEGAP_CUTOFF) {
        timeGapFound = true
      }
    }
  }

  const summary = {
    code,
    rateCount,
    firstActiveIndex,
  }
  consoleInfo(`ratesLoadFor: parsed summary:`, summary)

  consoleInfo(`ratesLoadFor: updating currency in db for ${code}...`)
  await currencyUpdate(summary)

  consoleInfo(`ratesLoadFor: saving rates array to db...`)
  await db.rates.put(interestRates)

  db.ratesCache = structuredClone(db.ratesCache)

  db.ratesCache[code] = interestRates.data

  consoleInfo(`ratesLoadFor: data loaded successfully for ${code}`)
  return
}

export default function ratesLoadFor(code: string | undefined) {
  return controller(db, code)
}
