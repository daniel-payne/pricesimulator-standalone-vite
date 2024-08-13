import useTimer from "@/data/indexDB/hooks/useTimer"
import formatTimestamp from "@/utilities/formatTimestamp"
import formatTimestampDay from "@/utilities/formatTimestampDay"
import { useQueryState } from "@keldan-systems/state-mutex"

import type { HTMLAttributes, PropsWithChildren } from "react"
import { Link } from "react-router-dom"

type ComponentProps = {
  name?: string
} & HTMLAttributes<HTMLDivElement>

export default function StatusesPage({ name = "StatusesPage", ...rest }: PropsWithChildren<ComponentProps>) {
  const [showJson, setShowJson] = useQueryState<boolean>("showJson", false)

  const timer = useTimer()

  return (
    <div {...rest} data-component={name}>
      <div className="flex flex-col gap-2 p-3">
        <div className="flex flex-row flex-wrap gap-2 items-center">
          <Link to="/" className="btn btn-primary btn-sm mx-2">
            Home
          </Link>
          <div className="text-secondary text-2xl font-bold">Timer</div>
          <button className="btn btn-primary btn-ghost btn-sm" onClick={() => setShowJson(!showJson)}>
            json
          </button>
        </div>
        <div className="flex-auto flex flex-row flex-wrap gap-0">
          <div className="w-96 p-2" key={timer?.id}>
            <div className="w-full h-full border border-primary rounded-xl p-2 overflow-hidden">
              <div className="text-primary text-xl font-bold">{timer?.id}</div>
              {showJson && <pre>{JSON.stringify(timer, null, 2)}</pre>}
              <div className="text-secondary font-bold">{formatTimestamp(timer?.currentTimestamp)}&nbsp;</div>
              <div className="text-secondary">{formatTimestampDay(timer?.currentTimestamp)}&nbsp;</div>
              <div className="text-secondary">{timer?.isTimerActive ? "ACTIVE" : "inactive"}&nbsp;</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
