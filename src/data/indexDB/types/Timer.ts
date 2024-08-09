import { ScenarioSpeed } from "../enums/ScenarioSpeed"

export type Timer = {
  id?: string

  startDay?: string
  speed?: ScenarioSpeed

  currentTimestamp?: number
  currentDay?: string

  isTimerActive?: boolean
}
