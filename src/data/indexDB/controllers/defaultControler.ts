import db from "@/data/indexDB/db"

import type { PriceSimulatorDexie } from "@/data/indexDB/db"

export async function controller(db: PriceSimulatorDexie) {
  return db ? null : db
}

export default function currentStatus() {
  return controller(db)
}
