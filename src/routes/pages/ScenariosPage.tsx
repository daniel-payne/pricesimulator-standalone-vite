import useScenarios from "@/data/indexDB/hooks/useScenarios"
import { useQueryState } from "@keldan-systems/state-mutex"

import type { HTMLAttributes, PropsWithChildren } from "react"
import { Link } from "react-router-dom"

type ComponentProps = {
  name?: string
} & HTMLAttributes<HTMLDivElement>

export default function ScenariosPage({ name = "ScenariosPage", ...rest }: PropsWithChildren<ComponentProps>) {
  const [showJson, setShowJson] = useQueryState<boolean>("showJson", false)

  const scenarios = useScenarios()

  return (
    <div {...rest} data-component={name}>
      <div className="flex flex-col gap-2 p-3">
        <div className="flex flex-row flex-wrap gap-2 items-center">
          <Link to="/" className="btn btn-primary btn-sm mx-2">
            Home
          </Link>
          <div className="text-secondary text-2xl font-bold">scenarios</div>
          <button className="btn btn-primary btn-ghost btn-sm" onClick={() => setShowJson(!showJson)}>
            json
          </button>
        </div>
        <div className="flex-auto flex flex-row flex-wrap gap-0">
          {scenarios?.map((scenario) => {
            return (
              <div className="w-96 p-2" key={scenario.code}>
                <div className="w-full h-full border border-primary rounded-xl p-2 overflow-hidden">
                  <div className="text-primary text-xl font-bold">{scenario.code}</div>
                  {showJson && <pre>{JSON.stringify(scenario, null, 2)}</pre>}
                  <div className="text-secondary font-bold">{scenario?.name}&nbsp;</div>
                  <div className="text-secondary">{scenario?.description}&nbsp;</div>
                  <div className="text-secondary">{scenario.symbols}&nbsp;</div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
