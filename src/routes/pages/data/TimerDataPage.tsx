import timerNextDay from "@/data/indexDB/controllers/timerNextDay"
import timerReset from "@/data/indexDB/controllers/timerReset"
import timerStart from "@/data/indexDB/controllers/timerStart"
import timerStop from "@/data/indexDB/controllers/timerStop"
import { ScenarioSpeed } from "@/data/indexDB/enums/ScenarioSpeed"
import useTimer from "@/data/indexDB/hooks/useTimer"
import CurrentDateDisplay from "@/display/components/CurrentDateDisplay"

import { useState, type HTMLAttributes, type PropsWithChildren } from "react"
import { Link } from "react-router-dom"

type ComponentProps = {
  name?: string
} & HTMLAttributes<HTMLDivElement>

export default function TimerDataPage({ name = "TimerDataPage", ...rest }: PropsWithChildren<ComponentProps>) {
  const [showJSON, setShowJSON] = useState(false)

  const timer = useTimer()

  return (
    <div {...rest} data-component={name}>
      <div className="p-2">
        <div className="flex flex-row gap-2 items-center p-2">
          <Link to="/">
            <img src="/pricesimulator-32.png" alt="Home Page" style={{ height: 32, width: 32 }} />
          </Link>
          <h1 className="text-xl text-secondary">Timer Data</h1>
          <button className={`btn btn-sm btn-primary ${showJSON ? "" : "btn-outline"}`} onClick={() => setShowJSON(!showJSON)}>
            json
          </button>
        </div>

        <div className="divider">Actions</div>
        <div className="flex flex-row gap-2 items-center flex-wrap p-2">
          <button className="btn btn-sm btn-primary" onClick={() => timerNextDay(true)}>
            Next Day
          </button>
          <div className="divider divider-horizontal"></div>
          <button className="btn btn-sm btn-success" onClick={() => timerStart(ScenarioSpeed.Slow)}>
            Start Slow Timer
          </button>
          <button className="btn btn-sm btn-success" onClick={() => timerStart(ScenarioSpeed.Medium)}>
            Start Medium Timer
          </button>
          <button className="btn btn-sm btn-success" onClick={() => timerStart(ScenarioSpeed.Fast)}>
            Start Fast Timer
          </button>
          <button className="btn btn-sm btn-warning" onClick={() => timerStop()}>
            Stop Timer
          </button>
          <button className="btn btn-sm btn-error" onClick={() => timerReset()}>
            Reset Timer
          </button>
          <button className="btn btn-sm btn-error btn-outline" onClick={() => timerReset("2020-01-09")}>
            Set Timer 2020
          </button>
        </div>

        <div className="divider">Components</div>
        <div className="flex flex-row gap-2 items-center flex-wrap p-2">
          <CurrentDateDisplay timer={timer} />
        </div>

        {showJSON && (
          <div>
            <div className="divider">JSON</div>
            <pre className="flex flex-row gap-2 items-center flex-wrap p-2">{JSON.stringify(timer, null, 2)}</pre>
          </div>
        )}
      </div>
    </div>
  )
}
