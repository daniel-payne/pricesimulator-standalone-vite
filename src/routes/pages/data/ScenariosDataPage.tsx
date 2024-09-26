import scenariosLoad from "@/data/indexDB/controllers/scenariosLoad"
import useScenarioData from "@/data/indexDB/hooks/useScenarios"
import { Scenario } from "@/data/indexDB/types/Scenario"
import ScenarioDetails from "@/display/components/ScenarioDetails"

import { useState, type HTMLAttributes, type PropsWithChildren } from "react"
import { Link } from "react-router-dom"

type ComponentProps = {
  name?: string
} & HTMLAttributes<HTMLDivElement>

export default function ScenariosDataPage({ name = "ScenariosDataPage", ...rest }: PropsWithChildren<ComponentProps>) {
  const [showJSON, setShowJSON] = useState(false)

  const scenarios = useScenarioData()

  return (
    <div {...rest} data-component={name}>
      <div className="p-2">
        <div className="flex flex-row gap-2 items-center p-2">
          <Link to="/">
            <img src="/pricesimulator-32.png" alt="Home Page" style={{ height: 32, width: 32 }} />
          </Link>
          <h1 className="text-xl text-secondary">Scenario Data</h1>
          <button className={`btn btn-sm btn-primary ${showJSON ? "" : "btn-outline"}`} onClick={() => setShowJSON(!showJSON)}>
            json
          </button>
        </div>

        <div className="divider">Actions</div>
        <div className="flex flex-row gap-2 items-center flex-wrap p-2">
          <button className="btn btn-sm btn-success" onClick={() => scenariosLoad()}>
            Reload
          </button>
        </div>

        <div className="divider">Components</div>
        <div className="flex flex-row gap-2 items-center flex-wrap p-2">
          {scenarios?.map((scenario: Scenario) => (
            <ScenarioDetails scenario={scenario} key={scenario.ref} />
          ))}
        </div>

        {showJSON && (
          <div>
            <div className="divider">JSON</div>
            <pre className="flex flex-row gap-2 items-center flex-wrap p-2">{JSON.stringify(scenarios, null, 2)}</pre>
          </div>
        )}
      </div>
    </div>
  )
}
